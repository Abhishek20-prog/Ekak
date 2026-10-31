"use client";
// Accessible button / link with balanced sizing, modern gradient, micro-interactions, and high-contrast support

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
    "inline-flex min-h-[46px] sm:min-h-[48px] items-center justify-center gap-2.5 rounded-xl px-5 py-2.5 text-center text-sm sm:text-base font-bold tracking-tight transition-all duration-200 " +
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-500/20 hover:from-indigo-700 hover:to-blue-700 hover:shadow-md hover:shadow-indigo-500/30 border border-transparent btn-primary",
    secondary:
      "border border-slate-300 dark:border-slate-700 bg-card hover:bg-current/10 hover:border-current text-foreground",
    danger:
      "border border-rose-500/80 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white",
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={finalClasses} aria-label={ariaLabel} {...props}>
        {icon && <span aria-hidden="true" className="text-lg leading-none">{icon}</span>}
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
      {icon && <span aria-hidden="true" className="text-lg leading-none">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
