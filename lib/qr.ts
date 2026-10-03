import qrcode from "qrcode-generator";

// הספרייה מקודדת כברירת מחדל 8 ביט לתו, וזה שובר עברית. מחליפים ל-UTF-8.
qrcode.stringToBytes = (s: string) => Array.from(new TextEncoder().encode(s));

/**
 * יוצר QR כתמונת PNG (data URL) על רקע לבן עם שוליים שקטים של 4 מודולים.
 * מחזיר "" אם הטקסט ארוך מדי.
 */
export function qrDataUrl(text: string, size: number, color: string): string {
  if (typeof document === "undefined" || !text) return "";
  let q: ReturnType<typeof qrcode> | null = null;
  for (const level of ["M", "L"] as const) {
    try {
      const t = qrcode(0, level);
      t.addData(text, "Byte");
      t.make();
      q = t;
      break;
    } catch {
      // ניסיון נוסף ברמת תיקון נמוכה יותר
    }
  }
  if (!q) return "";
  const n = q.getModuleCount();
  const margin = 4;
  const cell = Math.max(1, Math.floor(size / (n + margin * 2)));
  const dim = cell * (n + margin * 2);
  const c = document.createElement("canvas");
  c.width = c.height = dim;
  const x = c.getContext("2d");
  if (!x) return "";
  x.fillStyle = "#fff";
  x.fillRect(0, 0, dim, dim);
  x.fillStyle = color;
  for (let r = 0; r < n; r++)
    for (let k = 0; k < n; k++)
      if (q.isDark(r, k)) x.fillRect((k + margin) * cell, (r + margin) * cell, cell, cell);
  return c.toDataURL("image/png");
}
