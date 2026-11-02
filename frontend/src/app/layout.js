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
  themeColor: "#0d7377",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "EKAK (एकक) — Accessible Living, Learning, Work & Communication",
  description:
    "Ekak is an accessibility-first inclusive platform for individuals with disabilities in India — adaptive UI for deaf, blind, motor, and cognitive needs. Every one matters.",
  manifest: "/manifest.json",
  icons: {
    icon: "/ekak-logo.svg",
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
