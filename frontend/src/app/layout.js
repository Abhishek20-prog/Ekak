import { Inter } from "next/font/google";
import "./globals.css";
import ProfileProvider from "@/context/ProfileProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
