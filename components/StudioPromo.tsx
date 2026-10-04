import { GROWWITHU_BUILDER_URL, GROWWITHU_CONTACT_URL, studioWaUrl } from "@/lib/links";

/** הצעה עדינה לשירותי הסטודיו, בתחתית עמוד הבנייה */
export function StudioPromo() {
  // כפתור הוואטסאפ מוצג רק כשמוגדר NEXT_PUBLIC_WA_NUMBER אמיתי
  const wa = studioWaUrl();
  return (
    <section className="promo" aria-labelledby="promo-h">
      <div className="promo-text">
        <h2 id="promo-h">בנינו את הכלי הזה בחינם</h2>
        <p>צריכים אתר, דף נחיתה או אוטומציה לעסק?</p>
        <a className="promo-link" href={GROWWITHU_BUILDER_URL} target="_blank" rel="noopener">
          הכירו את <span dir="ltr">GrowWithU</span>
        </a>
      </div>
      <div className="promo-actions">
        <a className="btn primary" href={GROWWITHU_CONTACT_URL} target="_blank" rel="noopener">
          השאירו פרטים ונחזור אליכם
        </a>
        {wa && (
          <a className="btn" href={wa} target="_blank" rel="noopener noreferrer">
            דברו איתנו בוואטסאפ
          </a>
        )}
      </div>
    </section>
  );
}
