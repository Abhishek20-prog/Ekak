"use client";
// Accessible top header for SEVA FIRST — glassmorphism, gradient brand, adaptive status pills

import Link from "next/link";
import { usePathname } from "next/navigation";
import useProfile from "@/hooks/useProfile";

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
        className="group flex items-center gap-2.5 rounded-xl p-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500"
        aria-label="SEVA FIRST Home Dashboard"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-white shadow-md group-hover:scale-105 transition-transform"
          style={{ background: "var(--grad-primary)" }}
        >
          🤝
        </span>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-foreground flex items-center gap-1 leading-tight">
            SEVA{" "}
            <span className="gradient-text">FIRST</span>
          </span>
          <span className="text-[0.63rem] font-semibold uppercase tracking-widest text-foreground/50 -mt-0.5">
            Accessibility PWA
          </span>
        </div>
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
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              • {mode.fontScale}×
            </span>
          )}
          {mode.highContrast && (
            <span className="text-yellow-500 font-bold">• HC</span>
          )}
          {mode.captions && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">• CC</span>
          )}
          {mode.voice && (
            <span className="text-violet-600 dark:text-violet-400 font-bold">• 🎙</span>
          )}
        </div>

        {/* Settings button */}
        <Link
          href="/settings"
          className={`flex min-h-[38px] min-w-[38px] items-center justify-center gap-1.5 rounded-xl border px-3 py-1 text-xs sm:text-sm font-bold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500 ${
            isSettingsActive
              ? "text-white border-transparent shadow-md"
              : "border-foreground/15 bg-foreground/5 hover:bg-foreground/10 text-foreground"
          }`}
          style={isSettingsActive ? { background: "var(--grad-primary)", boxShadow: "var(--shadow-btn)" } : {}}
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
