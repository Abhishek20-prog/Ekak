"use client";
// Ekak — Rich, Glowing, Attractive Bottom Navigation Dock
// Floating island design with active glow, haptic feedback indicators, badge support, and animated active bar

import Link from "next/link";
import { usePathname } from "next/navigation";
import useProfile from "@/hooks/useProfile";

const NAV_ITEMS = [
  {
    href: "/home",
    label: "Home",
    labelHi: "होम",
    icon: "🏠",
    activeGlow: "from-blue-600/30 to-blue-700/20",
    activeAccent: "bg-blue-600",
  },
  {
    href: "/learn",
    label: "Learn",
    labelHi: "सीखें",
    icon: "📚",
    activeGlow: "from-amber-500/30 to-amber-600/20",
    activeAccent: "bg-amber-500",
  },
  {
    href: "/work",
    label: "Work",
    labelHi: "कार्य",
    icon: "💼",
    activeGlow: "from-blue-600/30 to-blue-700/20",
    activeAccent: "bg-blue-600",
  },
  {
    href: "/connect",
    label: "Connect",
    labelHi: "जोड़ें",
    icon: "💬",
    activeGlow: "from-amber-500/30 to-amber-600/20",
    activeAccent: "bg-amber-500",
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const isHi = profile?.language === "hi";

  return (
    /* Floating island container */
    <nav
      aria-label="Main Navigation"
      className="ekak-bottom-nav fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-0"
    >
      {/* The floating pill */}
      <div className="ekak-nav-pill mx-auto flex max-w-sm items-stretch justify-around rounded-3xl px-2 py-2 gap-1 shadow-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex flex-1 flex-col items-center justify-center rounded-2xl px-1 py-2 text-center transition-all duration-250 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 active:scale-90 min-h-[56px] ${
                isActive
                  ? `bg-gradient-to-b ${item.activeGlow} shadow-md`
                  : "hover:bg-foreground/8"
              }`}
            >
              {/* Active top glow bar */}
              {isActive && (
                <span
                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full ${item.activeAccent} shadow-lg opacity-90`}
                />
              )}

              {/* Icon */}
              <span
                aria-hidden="true"
                className={`text-[1.45rem] leading-none transition-all duration-200 ${
                  isActive
                    ? "scale-110 drop-shadow-sm"
                    : "group-hover:scale-110 group-hover:-translate-y-0.5 opacity-70 group-hover:opacity-100"
                }`}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span
                className={`mt-0.5 text-[0.62rem] sm:text-[0.68rem] leading-none transition-all duration-200 ${
                  isActive
                    ? "font-black text-foreground"
                    : "font-semibold text-foreground/60 group-hover:text-foreground/90"
                }`}
              >
                {isHi ? item.labelHi : item.label}
              </span>

              {/* Active pulsing dot badge */}
              {isActive && (
                <span className={`absolute -top-0.5 right-3 flex h-2 w-2`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${item.activeAccent} opacity-70`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${item.activeAccent}`} />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
