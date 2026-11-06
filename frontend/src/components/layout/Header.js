"use client";
// Ekak — Stunning, Rich, Interactive Header
// Animated gradient border, glowing logo halo, live clock, marquee accessibility status, shimmer settings

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile";
import { EkakLogo } from "@/components/ui";

const PAGE_META = {
  "/home":     { label: "Home",      labelHi: "होम",       icon: "🏠", color: "from-blue-600/20 to-blue-700/10",   badge: "bg-blue-600" },
  "/learn":    { label: "Learn",     labelHi: "सीखें",     icon: "📚", color: "from-amber-500/20 to-amber-600/10", badge: "bg-amber-500" },
  "/work":     { label: "Work",      labelHi: "कार्य",     icon: "💼", color: "from-blue-600/20 to-blue-700/10",  badge: "bg-blue-600" },
  "/connect":  { label: "Connect",   labelHi: "जोड़ें",    icon: "💬", color: "from-amber-400/20 to-amber-500/10", badge: "bg-amber-500" },
  "/settings": { label: "Settings",  labelHi: "सेटिंग्स",  icon: "⚙️", color: "from-blue-600/20 to-blue-700/10",   badge: "bg-blue-600" },
};

function LiveClock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!time) return null;

  return (
    <span className="hidden sm:flex flex-col items-end leading-none select-none">
      <span className="text-[0.8rem] font-black tabular-nums text-foreground/80 tracking-tight">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="text-[0.55rem] font-bold uppercase tracking-widest text-foreground/45 mt-0.5">
        {time.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
      </span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const { mode, language } = profile;
  const isHi = language === "hi";
  const isSettingsActive = pathname === "/settings";
  const page = PAGE_META[pathname];

  return (
    <header className="ekak-header sticky top-0 z-30">
      {/* ── Animated multi-colour gradient top edge ── */}
      <div className="ekak-header-glow-bar" aria-hidden="true" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">

        {/* ── LEFT: Glowing Logo Block ── */}
        <Link
          href="/home"
          className="group relative flex shrink-0 items-center gap-3 rounded-2xl p-1.5 pr-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 transition-all duration-200 hover:bg-blue-600/8"
          aria-label="Ekak — Go to Dashboard"
        >
          {/* Halo glow behind logo icon */}
          <span className="pointer-events-none absolute left-1 h-10 w-10 rounded-full bg-blue-500/20 blur-xl transition-all duration-300 group-hover:bg-blue-500/40 group-hover:scale-125" />
          <EkakLogo size="sm" className="relative z-10" />

          {/* Live "LIVE" badge */}
          <span className="absolute -top-1 -right-0.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-2 py-0.5 text-[0.52rem] font-black uppercase tracking-widest text-white shadow-sm shadow-blue-700/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            live
          </span>
        </Link>

        {/* ── CENTRE: Active Page Badge with gradient pill ── */}
        {page ? (
          <div className={`flex items-center gap-2.5 rounded-2xl border border-foreground/10 bg-gradient-to-r ${page.color} px-4 py-2 shadow-inner backdrop-blur-sm`}>
            <span
              aria-hidden="true"
              className="text-xl leading-none"
            >
              {page.icon}
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black text-foreground tracking-tight">
                {isHi ? page.labelHi : page.label}
              </span>
              <span className="text-[0.58rem] font-bold uppercase tracking-widest text-foreground/50 mt-0.5">
                Ekak {isHi ? "• एकक" : "• Accessibility"}
              </span>
            </div>
            {/* Coloured accent dot */}
            <span className={`ml-1 h-2.5 w-2.5 rounded-full ${page.badge} shadow-md animate-pulse`} />
          </div>
        ) : (
          <div />
        )}

        {/* ── RIGHT: Status Row + Settings ── */}
        <div className="flex items-center gap-2.5">

          {/* Live Clock */}
          <LiveClock />

          {/* Vertical divider */}
          <div className="hidden sm:block h-8 w-px bg-foreground/12" />

          {/* Accessibility status capsule */}
          <div
            aria-label="Active accessibility settings"
            className="hidden md:flex items-center gap-1.5 rounded-2xl border border-foreground/10 bg-foreground/5 px-3 py-1.5"
          >
            <span className="text-[0.68rem] font-black text-foreground/80">
              {isHi ? "🇮🇳" : "🌐"}
            </span>
            {mode.fontScale > 1.0 && (
              <span className="rounded-full bg-blue-600/15 border border-blue-600/20 px-2 py-0.5 text-[0.6rem] font-black text-blue-800 dark:text-blue-300">
                {mode.fontScale}×
              </span>
            )}
            {mode.highContrast && (
              <span className="rounded-full bg-yellow-500/15 border border-yellow-500/20 px-2 py-0.5 text-[0.6rem] font-black text-yellow-700 dark:text-yellow-300">
                HC
              </span>
            )}
            {mode.captions && (
              <span className="rounded-full bg-emerald-600/15 border border-emerald-600/20 px-2 py-0.5 text-[0.6rem] font-black text-emerald-700 dark:text-emerald-300">
                CC
              </span>
            )}
            {mode.voice && (
              <span className="rounded-full bg-amber-600/15 border border-amber-600/20 px-2 py-0.5 text-[0.6rem] font-black text-amber-700 dark:text-amber-300">
                🎙
              </span>
            )}
          </div>

          {/* Settings button — glowing on active, shimmer on hover */}
          <Link
            href="/settings"
            aria-label="Accessibility Settings"
            aria-current={isSettingsActive ? "page" : undefined}
            className={`ekak-settings-btn group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 px-4 py-2 text-xs sm:text-sm font-black transition-all duration-250 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 ${
              isSettingsActive
                ? "border-transparent text-white ekak-settings-active"
                : "border-foreground/12 bg-foreground/5 hover:border-blue-600/50 hover:bg-blue-600/8 text-foreground"
            }`}
          >
            {/* Shimmer sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/18 transition-transform duration-500 group-hover:translate-x-[160%]" />

            <span
              aria-hidden="true"
              className={`relative text-lg transition-all duration-300 ${
                isSettingsActive ? "rotate-[60deg]" : "group-hover:rotate-[25deg] group-hover:scale-110"
              }`}
            >
              ⚙️
            </span>
            <span className="relative hidden sm:inline">{isHi ? "सेटिंग्स" : "Settings"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
