import type { Metadata } from "next";
import { PublicCard } from "@/components/PublicCard";

export const metadata: Metadata = {
  title: "כרטיס ביקור דיגיטלי | כרטיס בכיס",
  description: "כרטיס ביקור דיגיטלי: חיוג, וואטסאפ, ניווט ושמירה לאנשי הקשר בלחיצה.",
  // הכרטיסים פרטיים ונמצאים רק בקישור, אין סיבה שיופיעו בגוגל
  robots: { index: false, follow: false },
  // Next מחליף את אובייקט ה-openGraph של ה-layout ולא ממזג אותו, אז חוזרים על השדות הקבועים
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "כרטיס בכיס",
    title: "כרטיס ביקור דיגיטלי | כרטיס בכיס",
    description: "כרטיס ביקור דיגיטלי: חיוג, וואטסאפ, ניווט ושמירה לאנשי הקשר בלחיצה.",
  },
  twitter: {
    card: "summary_large_image",
    title: "כרטיס ביקור דיגיטלי | כרטיס בכיס",
    description: "כרטיס ביקור דיגיטלי: חיוג, וואטסאפ, ניווט ושמירה לאנשי הקשר בלחיצה.",
  },
};

export default function PublicCardPage() {
  return <PublicCard />;
}
