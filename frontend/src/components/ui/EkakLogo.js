"use client";
// Accessible Ekak Brand Logo component — represents unity, dignity & accessibility for every one

import Image from "next/image";

export default function EkakLogo({ size = "md", showWordmark = true, className = "" }) {
  const sizeMap = {
    sm: { icon: 34, height: 36, textMain: "text-lg", textDev: "text-xs", textSub: "text-[0.55rem]" },
    md: { icon: 44, height: 46, textMain: "text-xl", textDev: "text-sm", textSub: "text-[0.62rem]" },
    lg: { icon: 58, height: 62, textMain: "text-2xl", textDev: "text-base", textSub: "text-[0.7rem]" },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Emblem */}
      <Image
        src="/ekak-logo-transparent.png"
        alt="Ekak Emblem — Caring hands supporting a golden sprout"
        width={s.icon}
        height={s.icon}
        priority={size === "lg" || size === "md"}
        className="shrink-0 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      />

      {/* Brand Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`${s.textMain} font-black tracking-tight text-[#194db8] dark:text-blue-400`}>
              EKAK
            </span>
            <span className={`${s.textDev} font-bold text-[#f59e0b] dark:text-amber-400 font-sans tracking-wide`}>
              एकक
            </span>
          </div>
          <span className={`${s.textSub} font-bold uppercase tracking-widest text-foreground/60 -mt-0.5`}>
            Accessibility • हर एक के लिए
          </span>
        </div>
      )}
    </div>
  );
}
