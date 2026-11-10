import localFont from "next/font/local";
import { Suspense } from "react";
import LiveRegions from "@/components/LiveRegions";
import RouteFocus from "@/components/RouteFocus";
import SiteHeader from "@/components/SiteHeader";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

// Atkinson Hyperlegible: designed by the Braille Institute for maximum character distinction.
const body = localFont({
  src: [
    { path: "../fonts/AtkinsonHyperlegible-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/AtkinsonHyperlegible-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "An app built to work well with screen readers and keyboards.",
};

// Runs before first paint so saved text size / contrast / motion settings never "flash".
const APPLY_PREFS = `(function(){try{var m=document.cookie.match(/(?:^|; )a11y=([^;]*)/);if(!m)return;var p=JSON.parse(decodeURIComponent(m[1])),d=document.documentElement;if(p.hc)d.dataset.contrast="high";if(p.rm)d.dataset.motion="reduce";if(p.sr)d.dataset.sr="on";if(p.fs&&p.fs!==100)d.dataset.fontScale=String(p.fs);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={body.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: APPLY_PREFS }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-10">
          {children}
        </main>
        <footer className="mx-auto max-w-3xl px-4 pb-10 text-sm" style={{ color: "var(--muted)" }}>
          <p>Need something to work differently? Change display and reading settings in your profile.</p>
        </footer>
        <LiveRegions />
        <Suspense fallback={null}>
          <RouteFocus />
        </Suspense>
      </body>
    </html>
  );
}
