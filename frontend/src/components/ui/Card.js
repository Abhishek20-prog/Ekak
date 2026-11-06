// Attractive, accessible Card — rich top gradient bar, layered depth, vibrant accent badges

import Link from "next/link";

export default function Card({
  children,
  as: Component = "article",
  title,
  icon,
  badge,
  href,
  onClick,
  accentColor = "blue",
  className = "",
  ...props
}) {
  const accentMap = {
    blue: {
      borderTop: "border-t-[3px] border-t-blue-600 dark:border-t-blue-400",
      hover: "hover:border-blue-500/80 hover:shadow-blue-900/10",
      ring: "focus-within:ring-2 focus-within:ring-blue-500/40",
      iconBg: "bg-blue-600/15 text-blue-800 dark:text-blue-300 border border-blue-600/30",
      badgeClass: "bg-blue-600/12 text-blue-900 dark:text-blue-200 border-blue-600/30",
    },
    amber: {
      borderTop: "border-t-[3px] border-t-amber-500 dark:border-t-amber-400",
      hover: "hover:border-amber-500/80 hover:shadow-amber-900/10",
      ring: "focus-within:ring-2 focus-within:ring-amber-500/40",
      iconBg: "bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30",
      badgeClass: "bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30",
    },
    teal: {
      borderTop: "border-t-[3px] border-t-blue-600 dark:border-t-blue-400",
      hover: "hover:border-blue-500/80 hover:shadow-blue-900/10",
      ring: "focus-within:ring-2 focus-within:ring-blue-500/40",
      iconBg: "bg-blue-600/15 text-blue-800 dark:text-blue-300 border border-blue-600/30",
      badgeClass: "bg-blue-600/12 text-blue-900 dark:text-blue-200 border-blue-600/30",
    },
    saffron: {
      borderTop: "border-t-[3px] border-t-amber-500 dark:border-t-amber-400",
      hover: "hover:border-amber-500/80 hover:shadow-amber-900/10",
      ring: "focus-within:ring-2 focus-within:ring-amber-500/40",
      iconBg: "bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30",
      badgeClass: "bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30",
    },
    olive: {
      borderTop: "border-t-[3px] border-t-emerald-600 dark:border-t-emerald-400",
      hover: "hover:border-emerald-500/80 hover:shadow-emerald-900/10",
      ring: "focus-within:ring-2 focus-within:ring-emerald-500/40",
      iconBg: "bg-emerald-600/15 text-emerald-900 dark:text-emerald-300 border border-emerald-600/30",
      badgeClass: "bg-emerald-600/12 text-emerald-900 dark:text-emerald-200 border-emerald-600/30",
    },
    violet: {
      borderTop: "border-t-[3px] border-t-violet-600 dark:border-t-violet-400",
      hover: "hover:border-violet-500/80 hover:shadow-violet-900/10",
      ring: "focus-within:ring-2 focus-within:ring-violet-500/40",
      iconBg: "bg-violet-600/15 text-violet-900 dark:text-violet-300 border border-violet-600/30",
      badgeClass: "bg-violet-600/12 text-violet-900 dark:text-violet-200 border-violet-600/30",
    },
    indigo: {
      borderTop: "border-t-[3px] border-t-blue-600 dark:border-t-blue-400",
      hover: "hover:border-blue-500/80 hover:shadow-blue-900/10",
      ring: "focus-within:ring-2 focus-within:ring-blue-500/40",
      iconBg: "bg-blue-600/15 text-blue-800 dark:text-blue-300 border border-blue-600/30",
      badgeClass: "bg-blue-600/12 text-blue-900 dark:text-blue-200 border-blue-600/30",
    },
    emerald: {
      borderTop: "border-t-[3px] border-t-emerald-600 dark:border-t-emerald-400",
      hover: "hover:border-emerald-500/80 hover:shadow-emerald-900/10",
      ring: "focus-within:ring-2 focus-within:ring-emerald-500/40",
      iconBg: "bg-emerald-600/15 text-emerald-900 dark:text-emerald-300 border border-emerald-600/30",
      badgeClass: "bg-emerald-600/12 text-emerald-900 dark:text-emerald-200 border-emerald-600/30",
    },
    amber: {
      borderTop: "border-t-[3px] border-t-amber-600 dark:border-t-amber-400",
      hover: "hover:border-amber-500/80 hover:shadow-amber-900/10",
      ring: "focus-within:ring-2 focus-within:ring-amber-500/40",
      iconBg: "bg-amber-600/15 text-amber-900 dark:text-amber-300 border border-amber-600/30",
      badgeClass: "bg-amber-600/12 text-amber-900 dark:text-amber-200 border-amber-600/30",
    },
  };

  const accent = accentMap[accentColor] || accentMap.blue;

  const cardClasses = [
    "group relative flex flex-col rounded-3xl border border-stone-200/90 dark:border-stone-800/90",
    accent.borderTop,
    "bg-card text-card-foreground p-5 sm:p-6 seva-card min-w-0",
    accent.hover,
    accent.ring,
    "transition-all duration-200",
  ].join(" ");

  const content = (
    <div className="flex flex-col flex-1 h-full min-w-0">
      {(title || icon || badge) && (
        <div className="mb-4 space-y-3 min-w-0">
          {/* Top row: Icon on left, Badge on right — zero overlap */}
          {(icon || badge) && (
            <div className="flex items-center justify-between gap-2 min-w-0">
              {icon && (
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl text-2xl leading-none shadow-xs transition-transform duration-200 group-hover:scale-105 ${accent.iconBg}`}
                >
                  {icon}
                </span>
              )}
              {badge && (
                <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black tracking-wide shadow-xs max-w-[65%] truncate ${accent.badgeClass}`}>
                  {badge}
                </span>
              )}
            </div>
          )}

          {/* Full-width Title: spacious, legible, never collides with badge */}
          {title && (
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground leading-snug break-words">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Card body: flex-1 flex flex-col justify-between so buttons align cleanly at bottom */}
      <div className="flex-1 flex flex-col justify-between space-y-4 min-w-0">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${cardClasses} block text-inherit no-underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 ${className}`}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${cardClasses} w-full text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 cursor-pointer ${className}`}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <Component className={`${cardClasses} ${className}`} {...props}>
      {content}
    </Component>
  );
}
