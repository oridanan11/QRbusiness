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

const TITLE = "כרטיס בכיס - כרטיס ביקור דיגיטלי חינם";
const DESCRIPTION =
  "בונים כרטיס ביקור דיגיטלי עם קוד QR, כפתורי וואטסאפ וניווט, וקישור אישי לשליחה ללקוחות. חינם, בלי הרשמה, והפרטים נשארים אצלכם.";

// כתובות התמונות בתגיות OG חייבות להיות מוחלטות. ב-Vercel הכתובת מגיעה אוטומטית
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "כרטיס בכיס", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "כרטיס בכיס",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2340b8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
