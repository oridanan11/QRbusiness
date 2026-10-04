import type { Metadata } from "next";
import { PublicCard } from "@/components/PublicCard";

export const metadata: Metadata = {
  title: "כרטיס ביקור דיגיטלי | כרטיס בכיס",
  description: "כרטיס ביקור דיגיטלי: חיוג, וואטסאפ, ניווט ושמירה לאנשי הקשר בלחיצה.",
  // הכרטיסים פרטיים ונמצאים רק בקישור, אין סיבה שיופיעו בגוגל
  robots: { index: false, follow: false },
};

export default function PublicCardPage() {
  return <PublicCard />;
}
