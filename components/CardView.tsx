"use client";

import { useMemo } from "react";
import {
  buildVcard,
  darkEnough,
  fileSafe,
  getActions,
  initials,
  onBrand,
  qrText,
  siteShow,
  waNum,
} from "@/lib/card";
import { downloadBlob } from "@/lib/download";
import { qrDataUrl } from "@/lib/qr";
import type { CardData, QrMode } from "@/lib/types";
import { Icon } from "./Icon";

interface Props {
  data: CardData;
  qrMode: QrMode;
  onQrMode: (m: QrMode) => void;
  onToast: (m: string) => void;
}

/** צבע ה-QR: צבע המותג אם הוא כהה מספיק, אחרת שחור */
export function qrColor(color: string) {
  return darkEnough(color) ? color : "#000000";
}

export function CardView({ data, qrMode, onQrMode, onToast }: Props) {
  const actions = getActions(data);
  const hasWa = !!waNum(data);
  const mode: QrMode = qrMode === "wa" && !hasWa ? "vcard" : qrMode;
  const color = data.color;

  const qrSrc = useMemo(
    () => qrDataUrl(qrText(data, mode), 480, qrColor(color)),
    [data, mode, color],
  );

  const details: [string, string][] = [];
  if (data.phone.trim()) details.push(["טלפון", data.phone.trim()]);
  if (data.email.trim()) details.push(["מייל", data.email.trim()]);
  if (siteShow(data)) details.push(["אתר", siteShow(data)]);
  if (data.addr.trim()) details.push(["כתובת", data.addr.trim()]);

  function saveContact() {
    if (!data.name.trim()) {
      onToast("הוסיפו שם כדי לשמור איש קשר");
      return;
    }
    const blob = new Blob([buildVcard(data, { photo: true })], {
      type: "text/vcard;charset=utf-8",
    });
    downloadBlob(blob, fileSafe(data.name) + ".vcf");
    onToast("הקובץ ירד");
  }

  return (
    <article
      className="card"
      data-t={data.template}
      style={
        {
          "--brand": color,
          "--on-brand": onBrand(color),
        } as React.CSSProperties
      }
    >
      <div className="top">
        <div className="cover" />
        <div className="avatar">
          {data.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logo} alt="" />
          ) : (
            initials(data.name)
          )}
        </div>
        <div className="who">
          <h2 className="name">{data.name.trim() || "השם שלך"}</h2>
          {data.role.trim() && <p className="role">{data.role.trim()}</p>}
          {data.biz.trim() && <span className="biz">{data.biz.trim()}</span>}
          {data.about.trim() && <p className="about">{data.about.trim()}</p>}
        </div>
      </div>

      {actions.length > 0 && (
        <div className="actions">
          {actions.map((a) => {
            const external = a.href.startsWith("http");
            return (
              <a
                key={a.key}
                className="act"
                href={a.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="ic">
                  <Icon name={a.icon} />
                </span>
                <span>{a.label}</span>
              </a>
            );
          })}
        </div>
      )}

      <div className="save-row">
        <button type="button" className="btn primary full" onClick={saveContact}>
          שמירת איש קשר
        </button>
      </div>

      {details.length > 0 && (
        <div className="details">
          {details.map(([k, v]) => (
            <div className="det" key={k}>
              <span>{k}</span>
              <span dir="auto">{v}</span>
            </div>
          ))}
        </div>
      )}

      <div className="qr-box">
        {qrSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrSrc} alt="קוד QR" />
        ) : (
          <div className="qr-fail">הפרטים ארוכים מדי ל-QR. קצרו קצת את הטקסטים.</div>
        )}
        <div className="qtxt">
          <b>{mode === "wa" ? "סרקו ודברו איתי" : "סרקו ושמרו אותי"}</b>
          <small>
            {mode === "wa"
              ? "סריקה פותחת שיחת וואטסאפ עם הודעה מוכנה"
              : "סריקה במצלמה מוסיפה את איש הקשר לטלפון"}
          </small>
          <div className="seg" role="group" aria-label="סוג QR">
            <button type="button" aria-pressed={mode === "vcard"} onClick={() => onQrMode("vcard")}>
              איש קשר
            </button>
            <button
              type="button"
              aria-pressed={mode === "wa"}
              onClick={() => {
                if (!hasWa) onToast("צריך להזין טלפון או וואטסאפ");
                else onQrMode("wa");
              }}
            >
              וואטסאפ
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
