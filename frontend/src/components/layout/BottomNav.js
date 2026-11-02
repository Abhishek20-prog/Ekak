"use client";
// Accessible bottom navigation dock — warm glassmorphism, teal active state

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home",    label: "Home",    icon: "🏠" },
  { href: "/learn",   label: "Learn",   icon: "📚" },
  { href: "/work",    label: "Work",    icon: "💼" },
  { href: "/connect", label: "Connect", icon: "💬" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main Navigation"
      className="glass fixed bottom-0 left-0 right-0 z-30 px-2 py-1.5 transition-all"
      style={{ borderTop: "1px solid rgba(228,221,211,0.65)" }}
    >
      <div className="mx-auto flex max-w-sm items-center justify-around gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex min-h-[50px] min-w-[60px] flex-1 flex-col items-center justify-center rounded-2xl py-1.5 px-1 text-center transition-all duration-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-600 active:scale-95 ${
                isActive
                  ? "text-white font-bold shadow-md btn-primary"
                  : "text-foreground/70 hover:bg-foreground/8 hover:text-foreground"
              }`}
            >
              <span
                aria-hidden="true"
                className={`text-xl leading-none transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </span>
              <span className={`text-[0.65rem] sm:text-[0.7rem] tracking-wide mt-0.5 ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
