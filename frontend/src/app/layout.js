import localFont from "next/font/local";
import "./globals.css";
import ProfileProvider from "@/context/ProfileProvider";
import LiveRegions from "@/components/LiveRegions";
import VoiceGuide from "@/components/VoiceGuide";

const fontSans = localFont({
  src: [
    { path: "../fonts/AtkinsonHyperlegible-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/AtkinsonHyperlegible-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

export const viewport = {
  themeColor: "#194db8",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "EKAK (एकक) — Accessible Living, Learning, Work & Communication",
  description:
    "Ekak is an accessibility-first inclusive platform for individuals with disabilities in India — adaptive UI for deaf, blind, motor, and cognitive needs. Every one matters.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/ekak-logo-transparent.png", sizes: "192x192", type: "image/png" },
      { url: "/ekak-logo.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ProfileProvider>{children}<LiveRegions /><VoiceGuide /></ProfileProvider>
      </body>
    </html>
  );
}
