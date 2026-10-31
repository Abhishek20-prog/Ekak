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
  themeColor: "#5b45e0",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "SEVA FIRST — Accessible Learning, Work & Communication",
  description:
    "An accessibility-first PWA for people with disabilities in India — adaptive UI for deaf, blind, motor, and cognitive needs. Learn, work, and connect inclusively.",
  manifest: "/manifest.json",
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
