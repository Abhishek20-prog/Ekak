"use client";
// Accessible Ekak Brand Logo component — represents unity, dignity & accessibility for every one

export default function EkakLogo({ size = "md", showWordmark = true, className = "" }) {
  const sizeMap = {
    sm: { icon: 32, height: 36, textMain: "text-lg", textDev: "text-xs", textSub: "text-[0.55rem]" },
    md: { icon: 40, height: 44, textMain: "text-xl", textDev: "text-sm", textSub: "text-[0.62rem]" },
    lg: { icon: 54, height: 58, textMain: "text-2xl", textDev: "text-base", textSub: "text-[0.7rem]" },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem SVG */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        role="img"
        aria-label="Ekak Emblem"
      >
        <defs>
          <linearGradient id="ekakTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--seva-primary, #0D7377)" />
            <stop offset="100%" stopColor="var(--seva-primary-light, #14968A)" />
          </linearGradient>
          <linearGradient id="ekakSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--seva-accent-light, #E07A3A)" />
            <stop offset="100%" stopColor="var(--seva-accent, #C55A2B)" />
          </linearGradient>
        </defs>

        {/* Outer unity roundel */}
        <circle cx="28" cy="28" r="26" fill="url(#ekakTeal)" />

        {/* Inner embrace cradle */}
        <path
          d="M16 34 C16 43, 40 43, 40 34 C40 28, 35 25, 28 25 C21 25, 16 28, 16 34 Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />

        {/* Central rising unity pillar / Devanagari 1 */}
        <path
          d="M25 18 C25 15, 28 14, 30 16 L31 34 C31 36, 25 36, 25 34 Z"
          fill="#FFFFFF"
        />

        {/* Saffron spark / dignity crown */}
        <circle
          cx="28"
          cy="13"
          r="4.5"
          fill="url(#ekakSaffron)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      </svg>

      {/* Brand Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`${s.textMain} font-black tracking-tight text-foreground`}>
              EKAK
            </span>
            <span className={`${s.textDev} font-bold text-amber-700 dark:text-amber-400 font-sans tracking-wide`}>
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

