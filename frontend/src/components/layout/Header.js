"use client";
// Accessible top header for Ekak — glassmorphism, brand logo, adaptive status pills

import Link from "next/link";
import { usePathname } from "next/navigation";
import useProfile from "@/hooks/useProfile";
import { EkakLogo } from "@/components/ui";

export default function Header() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const isSettingsActive = pathname === "/settings";

  const { mode, language } = profile;

  return (
    <header className="glass sticky top-0 z-30 flex min-h-[3.75rem] items-center justify-between px-4 py-2 sm:px-6 transition-all">
      {/* Brand logo & title */}
      <Link
        href="/home"
        className="group flex items-center rounded-xl p-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-600"
        aria-label="Ekak Home Dashboard"
      >
        <EkakLogo size="sm" />
      </Link>

      {/* Status pills + settings */}
      <div className="flex items-center gap-2">
        {/* Compact status pills — visible on medium+ screens */}
        <div
          aria-label="Current accessibility settings summary"
          className="hidden md:flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs font-semibold"
        >
          <span>{language === "hi" ? "🇮🇳 हिन्दी" : "🌐 English"}</span>
          {mode.fontScale > 1.0 && (
            <span className="text-teal-700 dark:text-teal-400 font-bold">
              • {mode.fontScale}×
            </span>
          )}
          {mode.highContrast && (
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">• HC</span>
          )}
          {mode.captions && (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">• CC</span>
          )}
          {mode.voice && (
            <span className="text-amber-700 dark:text-amber-400 font-bold">• 🎙</span>
          )}
        </div>

        {/* Settings button */}
        <Link
          href="/settings"
          className={`flex min-h-[38px] min-w-[38px] items-center justify-center gap-1.5 rounded-xl border px-3 py-1 text-xs sm:text-sm font-bold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-600 ${
            isSettingsActive
              ? "text-white border-transparent shadow-md btn-primary"
              : "border-foreground/15 bg-foreground/5 hover:bg-foreground/10 text-foreground"
          }`}
          aria-label="Accessibility Settings"
          aria-current={isSettingsActive ? "page" : undefined}
        >
          <span aria-hidden="true" className="text-base">⚙️</span>
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </div>
    </header>
  );
}
