"use client";
// Accessible, attractive button — rich gradient luster, micro-interactions, high-contrast support

import Link from "next/link";

export default function BigButton({
  children,
  onClick,
  href,
  variant = "primary",
  icon = null,
  disabled = false,
  type = "button",
  ariaLabel,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center gap-2.5 rounded-2xl px-6 py-3 text-center text-sm sm:text-base font-extrabold tracking-tight transition-all duration-200 " +
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer shadow-xs";

  const variantClasses = {
    primary:
      "text-white border border-blue-500/30 btn-primary",
    secondary:
      "border-2 border-slate-200 dark:border-slate-700 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-600 text-foreground shadow-xs",
    accent:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-black shadow-md shadow-amber-900/15 border border-amber-400/40",
    danger:
      "border-2 border-rose-500/80 bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-600 hover:text-white shadow-xs",
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={finalClasses} aria-label={ariaLabel} {...props}>
        {icon && <span aria-hidden="true" className="text-xl leading-none">{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      className={finalClasses}
      {...props}
    >
      {icon && <span aria-hidden="true" className="text-xl leading-none">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
