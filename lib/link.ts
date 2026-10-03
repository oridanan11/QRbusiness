import LZString from "lz-string";
import { COLORS, EMPTY, isHex } from "./card";
import type { CardData, Template, TextKey } from "./types";

export const MAX_LINK = 8000;

/** מפתחות קצרים כדי שהקישור יישאר קצר */
const SHORT: Record<TextKey, string> = {
  name: "n",
  role: "r",
  biz: "b",
  phone: "p",
  wa: "w",
  email: "e",
  site: "s",
  ig: "i",
  tiktok: "t",
  fb: "f",
  addr: "a",
  about: "u",
  booking: "k",
};
const TEXT_KEYS = Object.keys(SHORT) as TextKey[];
const TEMPLATE_IDS: Template[] = ["classic", "bold", "minimal"];

function pack(d: CardData, withLogo: boolean): string {
  const o: Record<string, string> = {};
  for (const k of TEXT_KEYS) if (d[k].trim()) o[SHORT[k]] = d[k].trim();
  o.c = d.color;
  o.m = d.template;
  if (withLogo && d.logoSmall) o.l = d.logoSmall;
  return LZString.compressToEncodedURIComponent(JSON.stringify(o));
}

export interface LinkResult {
  url: string;
  /** true אם התמונה לא נכנסה לקישור כי הוא היה ארוך מדי */
  logoDropped: boolean;
}

export function buildLink(d: CardData, origin: string): LinkResult {
  const base = origin + "/c#";
  const full = base + pack(d, true);
  if (!d.logoSmall || full.length <= MAX_LINK) return { url: full, logoDropped: false };
  return { url: base + pack(d, false), logoDropped: true };
}

/** קורא נתונים מהחלק שאחרי # בקישור. null אם הקישור ריק או שבור */
export function decodeCard(hash: string): CardData | null {
  const raw = hash.replace(/^#/, "");
  if (!raw) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(raw);
    if (!json) return null;
    const o: unknown = JSON.parse(json);
    if (!o || typeof o !== "object") return null;
    const rec = o as Record<string, unknown>;
    const str = (key: string) => (typeof rec[key] === "string" ? (rec[key] as string) : "");
    const d: CardData = { ...EMPTY };
    for (const k of TEXT_KEYS) d[k] = str(SHORT[k]).slice(0, 300);
    d.about = d.about.slice(0, 140);
    d.color = isHex(str("c")) ? str("c") : COLORS[0];
    const m = str("m") as Template;
    d.template = TEMPLATE_IDS.includes(m) ? m : "classic";
    const l = str("l");
    d.logo = /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(l) ? l : "";
    if (!d.name && !d.biz && !d.phone) return null;
    return d;
  } catch {
    return null;
  }
}
