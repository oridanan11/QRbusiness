/** קישורים לסטודיו, עם מעקב מקור התנועה */
export const GROWWITHU_URL =
  "https://growwithu.net?utm_source=kartis-bakis&utm_medium=card&utm_campaign=lead-magnet";

export const GROWWITHU_BUILDER_URL =
  "https://growwithu.net?utm_source=kartis-bakis&utm_medium=builder&utm_campaign=lead-magnet";

const PLACEHOLDER_NUMBER = "972500000000";

/**
 * מספר הוואטסאפ של הסטודיו, מתוך משתנה הסביבה NEXT_PUBLIC_WA_NUMBER.
 * מנרמל לפורמט בינלאומי בלי + (050-1234567 הופך ל-972501234567).
 * אם המשתנה לא הוגדר, או שנשאר מספר המקום-שמור, מחזיר "" והכפתור לא מוצג,
 * כדי שלא יוצג כפתור שמוביל למספר שלא קיים.
 */
export function studioWaNumber(): string {
  // חייב להיכתב כך (ולא דרך משתנה) כדי ש-Next יחליף אותו בזמן הבנייה
  let n = (process.env.NEXT_PUBLIC_WA_NUMBER ?? "").replace(/\D/g, "");
  if (n.startsWith("0")) n = "972" + n.slice(1);
  return n.length >= 11 && n !== PLACEHOLDER_NUMBER ? n : "";
}

export function studioWaUrl(): string {
  const n = studioWaNumber();
  return n ? `https://wa.me/${n}?text=${encodeURIComponent("היי, הגעתי מכרטיס בכיס")}` : "";
}
