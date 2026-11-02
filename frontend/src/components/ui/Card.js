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
  accentColor = "teal",
  className = "",
  ...props
}) {
  const accentMap = {
    teal: {
      borderTop: "border-t-[3px] border-t-teal-600 dark:border-t-teal-400",
      hover: "hover:border-teal-500/80 hover:shadow-teal-900/10",
      ring: "focus-within:ring-2 focus-within:ring-teal-500/40",
      iconBg: "bg-teal-600/15 text-teal-800 dark:text-teal-300 border border-teal-600/30",
      badgeClass: "bg-teal-600/12 text-teal-900 dark:text-teal-200 border-teal-600/30",
    },
    saffron: {
      borderTop: "border-t-[3px] border-t-amber-600 dark:border-t-amber-400",
      hover: "hover:border-amber-500/80 hover:shadow-amber-900/10",
      ring: "focus-within:ring-2 focus-within:ring-amber-500/40",
      iconBg: "bg-amber-600/15 text-amber-900 dark:text-amber-300 border border-amber-600/30",
      badgeClass: "bg-amber-600/12 text-amber-900 dark:text-amber-200 border-amber-600/30",
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
    // Compat aliases
    indigo: {
      borderTop: "border-t-[3px] border-t-teal-600 dark:border-t-teal-400",
      hover: "hover:border-teal-500/80 hover:shadow-teal-900/10",
      ring: "focus-within:ring-2 focus-within:ring-teal-500/40",
      iconBg: "bg-teal-600/15 text-teal-800 dark:text-teal-300 border border-teal-600/30",
      badgeClass: "bg-teal-600/12 text-teal-900 dark:text-teal-200 border-teal-600/30",
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

  const accent = accentMap[accentColor] || accentMap.teal;

  const cardClasses = [
    "group relative flex flex-col rounded-3xl border border-stone-200/90 dark:border-stone-800/90",
    accent.borderTop,
    "bg-card text-card-foreground p-6 sm:p-7 seva-card",
    accent.hover,
    accent.ring,
    "transition-all duration-200",
  ].join(" ");

  const content = (
    <>
      {(title || icon || badge) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {icon && (
              <span
                aria-hidden="true"
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl leading-none shadow-xs transition-transform duration-200 group-hover:scale-110 ${accent.iconBg}`}
              >
                {icon}
              </span>
            )}
            {title && (
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-snug">
                {title}
              </h2>
            )}
          </div>
          {badge && (
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold tracking-wide shadow-xs ${accent.badgeClass}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex-1 space-y-3">{children}</div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${cardClasses} block text-inherit no-underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-600 ${className}`}
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
        className={`${cardClasses} w-full text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-600 cursor-pointer ${className}`}
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
