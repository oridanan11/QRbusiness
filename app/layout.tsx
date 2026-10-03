import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Hebrew, Suez_One } from "next/font/google";
import "./globals.css";

const display = Suez_One({
  weight: "400",
  subsets: ["hebrew", "latin"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans_Hebrew({
  weight: ["400", "500", "600", "700"],
  subsets: ["hebrew", "latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "כרטיס בכיס - כרטיס ביקור דיגיטלי חינם",
  description:
    "בונים כרטיס ביקור דיגיטלי עם קוד QR, כפתורי וואטסאפ וניווט, וקישור אישי לשליחה ללקוחות. חינם, בלי הרשמה, והפרטים נשארים אצלכם.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
