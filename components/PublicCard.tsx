"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { GROWWITHU_URL } from "@/lib/links";
import { decodeCard } from "@/lib/link";
import type { QrMode } from "@/lib/types";
import { CardView } from "./CardView";
import { useToast } from "./Toast";

// ה-hash (החלק אחרי #) הוא "מקור חיצוני" שמשתנה בלי קשר ל-React
function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}
const getHash = () => window.location.hash;
const getServerHash = () => null;

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
}

/**
 * מחליף את ה-manifest הכללי באחד של הכרטיס הזה, כך שהוספה למסך הבית פותחת
 * את הכרטיס עצמו (עם ה-hash) ולא את עמוד הבנייה. בלי שירות חיצוני: ה-manifest
 * נבנה בדפדפן ונשמר כ-data URL.
 */
function applyManifest(name: string, color: string) {
  const origin = window.location.origin;
  const manifest = {
    name,
    short_name: name.slice(0, 12),
    lang: "he",
    dir: "rtl",
    start_url: window.location.href,
    scope: origin + "/c",
    display: "standalone",
    background_color: "#f3f5f8",
    theme_color: color,
    icons: [
      { src: origin + "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: origin + "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: origin + "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  const href = "data:application/manifest+json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest));
  let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.appendChild(link);
  }
  link.href = href;
  const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (theme) theme.content = color;
}

export function PublicCard() {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const data = useMemo(() => (hash === null ? null : decodeCard(hash)), [hash]);
  const [qrMode, setQrMode] = useState<QrMode>("vcard");
  const [installEvt, setInstallEvt] = useState<InstallEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const { show, node } = useToast();

  useEffect(() => {
    if (!data) return;
    const title = [data.name.trim(), data.biz.trim()].filter(Boolean).join(" | ") || "כרטיס ביקור דיגיטלי";
    // Next מחזיר את הכותרת הכללית מיד אחרי הטעינה, אז משגיחים ומחזירים את שם הכרטיס
    const applyTitle = () =>
      document.querySelectorAll("title").forEach((t) => {
        if (t.textContent !== title) t.textContent = title;
      });
    applyTitle();
    const observer = new MutationObserver(applyTitle);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    applyManifest(data.biz.trim() || data.name.trim() || "כרטיס ביקור", data.color);
    return () => observer.disconnect();
  }, [data]);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function addToHome() {
    if (installEvt) {
      try {
        await installEvt.prompt();
      } catch {
        // המשתמש סגר את החלון, אין מה לעשות
      }
      setInstallEvt(null);
      return;
    }
    setShowHelp((v) => !v);
  }

  const isIos =
    typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (hash === null) {
    return (
      <main className="pub">
        <p className="loading" aria-busy="true">טוענים את הכרטיס...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="pub">
        <section className="panel broken" role="alert">
          <h1>לא מצאנו כרטיס בקישור הזה</h1>
          <p>
            {hash.replace(/^#/, "")
              ? "הקישור נראה פגום, ייתכן שהוא נחתך בזמן ההעתקה. בקשו מהשולח לשלוח אותו שוב."
              : "הקישור ריק. בקשו מהשולח לשלוח את הקישור המלא של הכרטיס."}
          </p>
          <Link className="btn primary" href="/">
            צור כרטיס משלך
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="pub">
      <CardView data={data} qrMode={qrMode} onQrMode={setQrMode} onToast={show} />
      <div className="pub-actions">
        <button type="button" className="btn" onClick={addToHome}>
          הוספה למסך הבית
        </button>
        {showHelp && (
          <p className="note" role="status">
            {isIos
              ? "באייפון: לחצו על כפתור השיתוף בתחתית הדפדפן ואז על \"הוספה למסך הבית\"."
              : "בדפדפן: פתחו את התפריט (שלוש הנקודות) ובחרו \"הוספה למסך הבית\" או \"התקנת אפליקציה\"."}
          </p>
        )}
      </div>
      <Footer />
      {node}
    </main>
  );
}

function Footer() {
  return (
    <footer className="pub-foot">
      <Link href="/">נוצר בחינם עם כרטיס בכיס</Link>
      <a className="gwu" href={GROWWITHU_URL} target="_blank" rel="noopener">
        רוצה אתר או אוטומציה לעסק? <span dir="ltr">GrowWithU</span>
      </a>
    </footer>
  );
}
