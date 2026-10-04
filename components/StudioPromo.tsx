import { GROWWITHU_BUILDER_URL, studioWaUrl } from "@/lib/links";

/** הצעה עדינה לשירותי הסטודיו, בתחתית עמוד הבנייה */
export function StudioPromo() {
  const wa = studioWaUrl();
  return (
    <section className="promo" aria-labelledby="promo-h">
      <div className="promo-text">
        <h2 id="promo-h">בנינו את הכלי הזה בחינם</h2>
        <p>צריכים אתר, דף נחיתה או אוטומציה לעסק?</p>
      </div>
      <div className="promo-actions">
        {wa && (
          <a className="btn primary" href={wa} target="_blank" rel="noopener noreferrer">
            דברו איתנו בוואטסאפ
          </a>
        )}
        <a className="btn" href={GROWWITHU_BUILDER_URL} target="_blank" rel="noopener">
          <span dir="ltr">GrowWithU</span>
        </a>
      </div>
    </section>
  );
}
