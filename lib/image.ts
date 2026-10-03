/** חיתוך לריבוע והקטנה בדפדפן (canvas) */
function squareFrom(img: HTMLImageElement, size: number, mime: string, quality: number): string {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d");
  if (!x) return "";
  const m = Math.min(img.width, img.height);
  x.fillStyle = "#fff";
  x.fillRect(0, 0, size, size);
  x.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, size, size);
  return c.toDataURL(mime, quality);
}

export interface LogoPair {
  /** 256px לכרטיס המקומי */
  logo: string;
  /** 96px WebP באיכות נמוכה, לקישור */
  logoSmall: string;
}

export function processLogo(file: File): Promise<LogoPair> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const logo = squareFrom(img, 256, "image/jpeg", 0.85);
      let small = squareFrom(img, 96, "image/webp", 0.4);
      // דפדפן שלא תומך ב-WebP מחזיר PNG כבד. אז עדיף JPEG קטן
      if (!small.startsWith("data:image/webp")) small = squareFrom(img, 96, "image/jpeg", 0.4);
      resolve({ logo, logoSmall: small });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}
