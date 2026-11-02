"use client";
// Accessible Toggle component built on a native checkbox with balanced proportions, explicit label, and visual status

export default function Toggle({
  id,
  label,
  hint,
  checked,
  onChange,
  icon,
  disabled = false,
  className = "",
}) {
  const inputId = id || `toggle-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <label
      htmlFor={inputId}
      className={`group flex min-h-[52px] cursor-pointer items-center justify-between gap-4 rounded-2xl border border-stone-200/90 dark:border-stone-700/90 bg-card p-3.5 sm:p-4 transition-all hover:border-teal-500 hover:shadow-xs has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-teal-500/40 ${className}`}
    >
      <div className="flex items-center gap-3.5">
        {icon && (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-current/5 text-xl leading-none transition-transform group-hover:scale-105"
          >
            {icon}
          </span>
        )}
        <div className="space-y-0.5">
          <span className="text-base sm:text-lg font-bold text-foreground block tracking-tight">
            {label}
          </span>
          {hint && (
            <span className="text-xs sm:text-sm text-foreground/75 block leading-relaxed font-normal">
              {hint}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Visual status text */}
        <span
          aria-hidden="true"
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
            checked
              ? "bg-teal-600/10 text-teal-700 dark:text-teal-400 border-teal-500/30"
              : "bg-current/5 text-foreground/60 border-current/15"
          }`}
        >
          {checked ? "ON" : "OFF"}
        </span>

        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-6 w-6 rounded-md border-2 border-stone-400 dark:border-stone-600 text-teal-700 accent-teal-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-600 cursor-pointer"
        />
      </div>
    </label>
  );
}
