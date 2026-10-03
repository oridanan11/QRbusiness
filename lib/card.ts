import type { CardData, QrMode, Template } from "./types";

export const COLORS = [
  "#2340B8",
  "#0E7C66",
  "#C2410C",
  "#B4235A",
  "#6B2FD1",
  "#1E2430",
];

export const TEMPLATES: { id: Template; label: string; hint: string }[] = [
  { id: "classic", label: "קלאסי", hint: "פס צבע ותמונה עגולה" },
  { id: "bold", label: "מודגש", hint: "כותרת בצבע מלא" },
  { id: "minimal", label: "מינימלי", hint: "נקי ושקט" },
];

export const EMPTY: CardData = {
  name: "",
  role: "",
  biz: "",
  phone: "",
  wa: "",
  email: "",
  site: "",
  ig: "",
  tiktok: "",
  fb: "",
  addr: "",
  about: "",
  booking: "",
  color: COLORS[0],
  template: "classic",
  logo: "",
  logoSmall: "",
  sample: false,
};

export const SAMPLE: CardData = {
  ...EMPTY,
  name: "נועה לוי",
  role: "מעצבת שיער ובעלים",
  biz: "סטודיו נועה",
  phone: "050-1234567",
  email: "noa@studio-noa.co.il",
  site: "www.studio-noa.co.il",
  ig: "@studio.noa",
  tiktok: "@studio.noa",
  addr: "דיזנגוף 120, תל אביב",
  about: "תספורות, צבע ותסרוקות כלה. קובעים תור בוואטסאפ, תשובה תוך שעה.",
  booking: "www.studio-noa.co.il/book",
  color: "#B4235A",
  sample: true,
};

// ---------- טלפון וקישורים ----------

function digits(s: string) {
  return (s || "").replace(/[^\d+]/g, "");
}

/** 050-1234567 -> +972501234567 */
export function intl(s: string): string {
  const d = digits(s);
  if (!d) return "";
  if (d[0] === "+") return d;
  if (d.startsWith("00")) return "+" + d.slice(2);
  if (d[0] === "0") return "+972" + d.slice(1);
  return "+" + d;
}

/** מספר וואטסאפ בפורמט בינלאומי בלי +. אם ריק, משתמשים בטלפון */
export function waNum(d: CardData): string {
  return intl(d.wa || d.phone).replace("+", "");
}

function withHttps(s: string): string {
  const t = (s || "").trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : "https://" + t;
}

export const siteUrl = (d: CardData) => withHttps(d.site);
export const bookingUrl = (d: CardData) => withHttps(d.booking);

export function siteShow(d: CardData): string {
  return (d.site || "").trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function handle(s: string, domain: RegExp): string {
  return (s || "")
    .trim()
    .replace(domain, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
}

export const igHandle = (d: CardData) =>
  handle(d.ig, /^https?:\/\/(www\.)?instagram\.com\//i);

export const tiktokHandle = (d: CardData) =>
  handle(d.tiktok, /^https?:\/\/(www\.)?tiktok\.com\/@?/i);

export function fbUrl(d: CardData): string {
  const t = (d.fb || "").trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  if (/facebook\.com|fb\.com/i.test(t)) return "https://" + t;
  return "https://facebook.com/" + t.replace(/^@/, "");
}

export const igUrl = (d: CardData) =>
  igHandle(d) ? "https://instagram.com/" + igHandle(d) : "";
export const tiktokUrl = (d: CardData) =>
  tiktokHandle(d) ? "https://tiktok.com/@" + tiktokHandle(d) : "";
export const wazeUrl = (d: CardData) =>
  d.addr.trim()
    ? "https://waze.com/ul?q=" + encodeURIComponent(d.addr.trim()) + "&navigate=yes"
    : "";

// ---------- כפתורי פעולה ----------

export type IconName =
  | "call"
  | "wa"
  | "mail"
  | "web"
  | "ig"
  | "tiktok"
  | "fb"
  | "nav"
  | "book";

export interface ActionItem {
  key: string;
  href: string;
  label: string;
  icon: IconName;
}

/** רק שדות שמולאו מקבלים כפתור */
export function getActions(d: CardData): ActionItem[] {
  const out: ActionItem[] = [];
  const add = (key: string, href: string, label: string, icon: IconName) => {
    if (href) out.push({ key, href, label, icon });
  };
  add("call", d.phone.trim() ? "tel:" + intl(d.phone) : "", "חיוג", "call");
  add("wa", waNum(d) ? "https://wa.me/" + waNum(d) : "", "וואטסאפ", "wa");
  add("mail", d.email.trim() ? "mailto:" + d.email.trim() : "", "מייל", "mail");
  add("web", siteUrl(d), "אתר", "web");
  add("ig", igUrl(d), "אינסטגרם", "ig");
  add("tiktok", tiktokUrl(d), "טיקטוק", "tiktok");
  add("fb", fbUrl(d), "פייסבוק", "fb");
  add("nav", wazeUrl(d), "ניווט", "nav");
  add("book", bookingUrl(d), "קביעת תור", "book");
  return out;
}

// ---------- צבעים ----------

export function isHex(c: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(c);
}

function luma(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
}

/** כהה מספיק כדי להיות צבע ה-QR */
export const darkEnough = (hex: string) => isHex(hex) && luma(hex) < 150;

/** צבע טקסט קריא מעל צבע המותג */
export const onBrand = (hex: string) =>
  isHex(hex) && luma(hex) > 170 ? "#151821" : "#ffffff";

// ---------- vCard ----------

const esc = (s: string) =>
  (s || "").replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\r?\n/g, "\\n");

/** שורה ארוכה מקוצרת לפי התקן: המשך שורה מתחיל ברווח */
function fold(line: string): string[] {
  if (line.length <= 75) return [line];
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(" " + line.slice(i, i + 74));
  return parts;
}

interface VcardOptions {
  /** תמונה, רק בקובץ ה-vcf ולא ב-QR */
  photo?: boolean;
  /** פרטי קשר בלבד, בלי רשתות חברתיות ובלי המשפט על העסק (ל-QR) */
  compact?: boolean;
}

/** vCard 3.0. שורות מופרדות ב-CRLF לפי התקן */
export function buildVcard(d: CardData, opts: VcardOptions = {}): string {
  const parts = d.name.trim().split(/\s+/);
  const first = parts.shift() || "";
  const last = parts.join(" ");
  const L: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(last)};${esc(first)};;;`,
    `FN:${esc(d.name.trim())}`,
  ];
  if (d.biz.trim()) L.push("ORG:" + esc(d.biz.trim()));
  if (d.role.trim()) L.push("TITLE:" + esc(d.role.trim()));
  if (d.phone.trim()) L.push("TEL;TYPE=CELL:" + intl(d.phone));
  if (d.wa.trim() && intl(d.wa) !== intl(d.phone)) L.push("TEL;TYPE=WORK:" + intl(d.wa));
  if (d.email.trim()) L.push("EMAIL:" + d.email.trim());
  if (siteUrl(d)) L.push("URL:" + siteUrl(d));
  if (d.addr.trim()) L.push(`ADR;TYPE=WORK:;;${esc(d.addr.trim())};;;;`);
  // ב-QR נשארים פרטי הקשר בלבד: כל שדה נוסף מצפין את הקוד וקשה יותר לסרוק אותו
  if (!opts.compact) {
    if (igUrl(d)) L.push("X-SOCIALPROFILE;TYPE=instagram:" + igUrl(d));
    if (tiktokUrl(d)) L.push("X-SOCIALPROFILE;TYPE=tiktok:" + tiktokUrl(d));
    if (fbUrl(d)) L.push("X-SOCIALPROFILE;TYPE=facebook:" + fbUrl(d));
    if (bookingUrl(d)) L.push("URL;TYPE=booking:" + bookingUrl(d));
    if (d.about.trim()) L.push("NOTE:" + esc(d.about.trim()));
  }
  const prefix = "data:image/jpeg;base64,";
  if (opts.photo && d.logo.startsWith(prefix)) {
    L.push(...fold("PHOTO;ENCODING=b;TYPE=JPEG:" + d.logo.slice(prefix.length)));
  }
  L.push("END:VCARD");
  return L.join("\r\n") + "\r\n";
}

// ---------- תוכן ה-QR וטקסט להעתקה ----------

export function qrText(d: CardData, mode: QrMode): string {
  if (mode === "wa" && waNum(d)) {
    const first = d.name.trim().split(/\s+/)[0] || "";
    const hello = first ? `היי ${first}, ` : "היי, ";
    return (
      "https://wa.me/" +
      waNum(d) +
      "?text=" +
      encodeURIComponent(hello + "הגעתי מהכרטיס הדיגיטלי שלך")
    );
  }
  return buildVcard(d, { compact: true });
}

export function cardAsText(d: CardData): string {
  const L: string[] = [];
  if (d.name.trim()) L.push("*" + d.name.trim() + "*");
  const rb = [d.role.trim(), d.biz.trim()].filter(Boolean).join(" | ");
  if (rb) L.push(rb);
  if (d.about.trim()) L.push("", d.about.trim());
  L.push("");
  if (d.phone.trim()) L.push("📞 " + d.phone.trim());
  if (waNum(d)) L.push("💬 https://wa.me/" + waNum(d));
  if (d.email.trim()) L.push("✉️ " + d.email.trim());
  if (siteUrl(d)) L.push("🌐 " + siteUrl(d));
  if (igUrl(d)) L.push("📷 " + igUrl(d));
  if (tiktokUrl(d)) L.push("🎵 " + tiktokUrl(d));
  if (fbUrl(d)) L.push("👍 " + fbUrl(d));
  if (d.addr.trim()) L.push("📍 " + d.addr.trim() + " | " + wazeUrl(d));
  if (bookingUrl(d)) L.push("📅 קביעת תור: " + bookingUrl(d));
  return L.join("\n").trim();
}

export function initials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return p.length ? Array.from(p[0])[0] + (p[1] ? Array.from(p[1])[0] : "") : "?";
}

export function fileSafe(s: string): string {
  return s.trim().replace(/[\\/:*?"<>|.]+/g, "").replace(/\s+/g, "-") || "contact";
}
