"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, EMPTY, SAMPLE, TEMPLATES, cardAsText, isHex, qrText, waNum } from "@/lib/card";
import { downloadDataUrl } from "@/lib/download";
import { processLogo } from "@/lib/image";
import { MAX_LINK, buildLink, type LinkResult } from "@/lib/link";
import { qrDataUrl } from "@/lib/qr";
import { loadCard, saveCard } from "@/lib/storage";
import type { CardData, QrMode, TextKey } from "@/lib/types";
import { CardView, qrColor } from "./CardView";
import { useToast } from "./Toast";

interface Field {
  key: TextKey;
  label: string;
  type?: "text" | "tel" | "email" | "url";
  ltr?: boolean;
  placeholder?: string;
  hint?: string;
  full?: boolean;
  autoComplete?: string;
}

const FIELDS: Field[] = [
  { key: "name", label: "שם מלא", autoComplete: "name" },
  { key: "role", label: "תפקיד" },
  { key: "biz", label: "שם העסק", full: true },
  { key: "phone", label: "טלפון", type: "tel", ltr: true, placeholder: "050-0000000" },
  { key: "wa", label: "וואטסאפ", type: "tel", ltr: true, placeholder: "ריק = אותו מספר", hint: "אם ריק, משתמשים בטלפון" },
  { key: "email", label: "מייל", type: "email", ltr: true },
  { key: "site", label: "אתר", type: "url", ltr: true, placeholder: "www.example.co.il" },
  { key: "ig", label: "אינסטגרם", ltr: true, placeholder: "@username" },
  { key: "tiktok", label: "טיקטוק", ltr: true, placeholder: "@username" },
  { key: "fb", label: "פייסבוק", ltr: true, placeholder: "שם הדף או קישור" },
  { key: "addr", label: "כתובת", hint: "יוצר כפתור ניווט ב-Waze", full: true },
  { key: "booking", label: "קישור לקביעת תור", type: "url", ltr: true, placeholder: "לא חובה", hint: "לא חובה", full: true },
];

export function Builder() {
  const [data, setData] = useState<CardData>(SAMPLE);
  const [ready, setReady] = useState(false);
  const [qrMode, setQrMode] = useState<QrMode>("vcard");
  const [link, setLink] = useState<LinkResult | null>(null);
  const [fallbackText, setFallbackText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { show, node } = useToast();

  // טעינה מ-localStorage רק בדפדפן, כדי שה-HTML הסטטי יהיה זהה אצל כולם
  useEffect(() => {
    const saved = loadCard();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setData(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveCard(data);
  }, [data, ready]);

  /** כל שינוי בכרטיס מבטל קישור ישן, כדי שלא יישלח קישור שלא מתאים למה שרואים */
  function update(patch: Partial<CardData>) {
    setData((d) => ({ ...d, ...patch, sample: false }));
    setLink(null);
  }

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const pair = await processLogo(f);
      update(pair);
      show("התמונה עודכנה");
    } catch {
      show("לא הצלחנו לקרוא את הקובץ. נסו JPG או PNG");
    }
  }

  function clearAll() {
    if (!window.confirm("למחוק את כל הפרטים ולהתחיל מאפס?")) return;
    setData({ ...EMPTY, color: data.color, template: data.template });
    setLink(null);
    setFallbackText("");
    show("הכרטיס התנקה");
  }

  function loadSample() {
    setData(SAMPLE);
    setLink(null);
    show("נטענה דוגמה");
  }

  async function copy(text: string, okMsg: string) {
    try {
      await navigator.clipboard.writeText(text);
      setFallbackText("");
      show(okMsg);
    } catch {
      setFallbackText(text);
      show("סמנו והעתיקו את הטקסט");
    }
  }

  async function downloadQr() {
    const mode: QrMode = qrMode === "wa" && !waNum(data) ? "vcard" : qrMode;
    const url = qrDataUrl(qrText(data, mode), 1200, qrColor(data.color));
    if (!url) {
      show("הפרטים ארוכים מדי ל-QR");
      return;
    }
    await downloadDataUrl(url, mode === "wa" ? "qr-whatsapp.png" : "qr-contact.png");
    show("הקובץ ירד");
  }

  function makeLink() {
    const r = buildLink(data, window.location.origin);
    setLink(r);
    show("הקישור מוכן");
  }

  const waShare = link
    ? "https://wa.me/?text=" + encodeURIComponent("הכרטיס הדיגיטלי שלי: " + link.url)
    : "";

  if (!ready) {
    return <div className="loading" aria-busy="true">טוענים...</div>;
  }

  return (
    <>
      <div className="grid">
        {/* טופס */}
        <div>
          <section className="panel">
            <h2>הפרטים שלך</h2>
            <p className="sub">כל שינוי מופיע מיד בכרטיס. הפרטים נשמרים רק במכשיר שלך.</p>
            <div className="fields">
              {FIELDS.map((f) => (
                <div key={f.key} className={"f" + (f.full ? " full" : "")}>
                  <label htmlFor={"f-" + f.key}>{f.label}</label>
                  <input
                    id={"f-" + f.key}
                    type={f.type ?? "text"}
                    dir={f.ltr ? "ltr" : undefined}
                    placeholder={f.placeholder}
                    autoComplete={f.autoComplete}
                    value={data[f.key]}
                    onChange={(e) => update({ [f.key]: e.target.value })}
                  />
                  {f.hint && <small>{f.hint}</small>}
                </div>
              ))}
              <div className="f full">
                <label htmlFor="f-about">משפט על העסק</label>
                <textarea
                  id="f-about"
                  maxLength={140}
                  value={data.about}
                  onChange={(e) => update({ about: e.target.value })}
                />
                <small>{data.about.length}/140 תווים</small>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>עיצוב</h2>
            <p className="sub">תבנית, צבע המותג ולוגו או תמונה</p>
            <div className="fields">
              <div className="f full">
                <span className="lbl" id="tpl-l">תבנית</span>
                <div className="tpls" role="group" aria-labelledby="tpl-l">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="tpl"
                      aria-pressed={data.template === t.id}
                      onClick={() => update({ template: t.id })}
                    >
                      <b>{t.label}</b>
                      <small>{t.hint}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="f full">
                <span className="lbl" id="sw-l">צבע</span>
                <div className="swatches" role="group" aria-labelledby="sw-l">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="sw"
                      style={{ background: c }}
                      aria-label={"צבע " + c}
                      aria-pressed={data.color.toLowerCase() === c.toLowerCase()}
                      onClick={() => update({ color: c })}
                    />
                  ))}
                  <label className="custom-color">
                    <input
                      type="color"
                      value={isHex(data.color) ? data.color : COLORS[0]}
                      onChange={(e) => update({ color: e.target.value })}
                    />
                    <span>צבע חופשי</span>
                  </label>
                </div>
              </div>

              <div className="f full">
                <span className="lbl">לוגו או תמונה</span>
                <div className="upload">
                  <div className="thumb">
                    {data.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.logo} alt="" />
                    ) : (
                      "אין"
                    )}
                  </div>
                  <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
                    העלאת תמונה
                  </button>
                  <input
                    ref={fileRef}
                    className="sr-only"
                    id="f-logo"
                    type="file"
                    accept="image/*"
                    onChange={onLogo}
                    aria-label="העלאת לוגו או תמונה"
                    tabIndex={-1}
                  />
                  {data.logo && (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => update({ logo: "", logoSmall: "" })}
                    >
                      הסרה
                    </button>
                  )}
                </div>
                <small>התמונה נחתכת לריבוע ונשארת רק במכשיר שלך.</small>
              </div>
            </div>
            <div className="row mt">
              <button type="button" className="btn" onClick={clearAll}>
                ניקוי והתחלה מאפס
              </button>
              <button type="button" className="btn" onClick={loadSample}>
                טעינת דוגמה
              </button>
            </div>
            {data.sample && (
              <div className="note">
                <b>זו דוגמה.</b> מוצגת מספרה בדויה בשם &quot;סטודיו נועה&quot;. החליפו את הפרטים בשלכם.
              </div>
            )}
          </section>

          <section className="panel">
            <h2>הקישור האישי שלי</h2>
            <p className="sub">קישור לכרטיס שאפשר לשלוח ללקוחות. הנתונים נשמרים בתוך הקישור עצמו.</p>
            <button type="button" className="btn primary" onClick={makeLink}>
              יצירת קישור
            </button>
            {link && (
              <div className="linkbox">
                <label htmlFor="f-link" className="lbl">הקישור שלך</label>
                <input
                  id="f-link"
                  type="text"
                  dir="ltr"
                  readOnly
                  value={link.url}
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="row mt-s">
                  <button type="button" className="btn" onClick={() => copy(link.url, "הועתק")}>
                    העתקת הקישור
                  </button>
                  <a className="btn" href={waShare} target="_blank" rel="noopener noreferrer">
                    שליחה בוואטסאפ
                  </a>
                  <a className="btn" href={link.url} target="_blank" rel="noopener noreferrer">
                    פתיחת הכרטיס
                  </a>
                </div>
                <small>אורך הקישור: {link.url.length} תווים (מתחת ל-{MAX_LINK})</small>
                {link.logoDropped && (
                  <div className="note warn">
                    התמונה לא נכנסה לקישור כי הוא היה ארוך מדי (מעל {MAX_LINK} תווים). הקישור
                    עובד, אבל הכרטיס ייראה בו בלי התמונה. הכרטיס כאן אצלך, וקובץ איש הקשר שמורידים,
                    עדיין כוללים אותה.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* תצוגה חיה */}
        <aside className="preview-col">
          <div className="ex-tag">ככה הכרטיס נראה בטלפון</div>
          <CardView data={data} qrMode={qrMode} onQrMode={setQrMode} onToast={show} />
          <div className="under">
            <button type="button" className="btn primary" onClick={() => copy(cardAsText(data), "הועתק! הדביקו בוואטסאפ")}>
              העתקת הכרטיס כטקסט
            </button>
            <button type="button" className="btn" onClick={downloadQr}>
              הורדת QR כתמונה
            </button>
          </div>
          {fallbackText && (
            <textarea
              className="copyfall"
              rows={6}
              readOnly
              value={fallbackText}
              aria-label="טקסט להעתקה ידנית"
              onFocus={(e) => e.currentTarget.select()}
            />
          )}
        </aside>
      </div>
      {node}
    </>
  );
}
