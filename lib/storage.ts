import { EMPTY } from "./card";
import type { CardData } from "./types";

const KEY = "kartis";

/** כל קריאה וכתיבה ב-try/catch: גלישה בסתר או דפדפן חוסם עלולים לזרוק שגיאה */
export function loadCard(): CardData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const o: unknown = JSON.parse(raw);
    if (o && typeof o === "object") return { ...EMPTY, ...(o as Partial<CardData>) };
  } catch {
    // מתעלמים
  }
  return null;
}

export function saveCard(d: CardData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // מתעלמים: המשתמש עדיין יכול להמשיך לעבוד
  }
}
