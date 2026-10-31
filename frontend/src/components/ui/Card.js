// Premium accessible Card — refined elevation, accent borders, glassmorphism tint

import Link from "next/link";

export default function Card({
  children,
  as: Component = "article",
  title,
  icon,
  badge,
  href,
  onClick,
  accentColor = "indigo",
  className = "",
  ...props
}) {
  const accentMap = {
    indigo: {
      hover: "hover:border-indigo-400/60 dark:hover:border-indigo-500/50",
      ring: "focus-within:ring-2 focus-within:ring-indigo-400/40",
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    emerald: {
      hover: "hover:border-emerald-400/60 dark:hover:border-emerald-500/50",
      ring: "focus-within:ring-2 focus-within:ring-emerald-400/40",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      hover: "hover:border-amber-400/60 dark:hover:border-amber-500/50",
      ring: "focus-within:ring-2 focus-within:ring-amber-400/40",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    violet: {
      hover: "hover:border-violet-400/60 dark:hover:border-violet-500/50",
      ring: "focus-within:ring-2 focus-within:ring-violet-400/40",
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  };

  const accent = accentMap[accentColor] || accentMap.indigo;

  const cardClasses = [
    "group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80",
    "bg-card text-card-foreground p-5 sm:p-6 seva-card",
    accent.hover,
    accent.ring,
    "transition-all duration-200",
  ].join(" ");

  const content = (
    <>
      {(title || icon || badge) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {icon && (
              <span
                aria-hidden="true"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl leading-none transition-transform group-hover:scale-105 ${accent.iconBg}`}
              >
                {icon}
              </span>
            )}
            {title && (
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
                {title}
              </h2>
            )}
          </div>
          {badge && (
            <span className="badge-highlight shrink-0 rounded-full border border-current/20 bg-current/6 px-3 py-0.5 text-xs font-semibold tracking-wide opacity-85">
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
        className={`${cardClasses} block text-inherit no-underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500 ${className}`}
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
        className={`${cardClasses} w-full text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500 cursor-pointer ${className}`}
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
