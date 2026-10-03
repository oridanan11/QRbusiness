export type Template = "classic" | "bold" | "minimal";

export interface CardData {
  name: string;
  role: string;
  biz: string;
  phone: string;
  wa: string;
  email: string;
  site: string;
  ig: string;
  tiktok: string;
  fb: string;
  addr: string;
  about: string;
  booking: string;
  color: string;
  template: Template;
  /** תמונה מקומית, 256px (JPEG). נשמרת רק בדפדפן */
  logo: string;
  /** גרסה קטנה, 96px (WebP), שנכנסת לקישור האישי אם יש מקום */
  logoSmall: string;
  /** true כל עוד מוצגת דוגמה */
  sample: boolean;
}

export type TextKey =
  | "name"
  | "role"
  | "biz"
  | "phone"
  | "wa"
  | "email"
  | "site"
  | "ig"
  | "tiktok"
  | "fb"
  | "addr"
  | "about"
  | "booking";

export type QrMode = "vcard" | "wa";
