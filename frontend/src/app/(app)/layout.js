"use client";
// Shared layout for app routes: Header, BottomNav, skip link

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to main content - accessible keyboard shortcut */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-blue-800 focus:px-4 focus:py-3 focus:text-lg focus:font-bold focus:text-white focus:outline-none focus:ring-4 focus:ring-amber-400"
      >
        Skip to main content
      </a>

      <Header />

      <div id="main-content" tabIndex={-1} className="flex-1 pb-36 focus:outline-none">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}
