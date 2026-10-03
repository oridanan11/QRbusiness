import { Builder } from "@/components/Builder";

export default function Home() {
  return (
    <div className="wrap">
      <header className="top-bar">
        <div className="logo">
          <div className="logo-mark" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="11" r="2" />
              <path d="M6 16c.8-1.4 1.8-2 3-2s2.2.6 3 2M15 10h3M15 13h3" />
            </svg>
          </div>
          <div>
            <h1>כרטיס בכיס</h1>
            <p>כרטיס ביקור דיגיטלי עם QR, מוכן תוך דקה</p>
          </div>
        </div>
        <span className="free">חינם, בלי הרשמה</span>
      </header>
      <Builder />
    </div>
  );
}
