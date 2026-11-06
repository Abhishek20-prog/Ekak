// PageTitle — blue & amber badge, tight hierarchy, animated entrance

export default function PageTitle({ title, subtitle, badge, className = "" }) {
  return (
    <div className={`animate-fade-up space-y-2.5 ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-600/25 bg-blue-600/10 px-3 py-1 text-[0.7rem] sm:text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" aria-hidden="true" />
          {badge}
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-black tracking-tight text-foreground leading-[1.18]">
        {title}
      </h1>
      {subtitle && (
        <p className="max-w-2xl text-sm sm:text-base text-foreground/70 leading-[1.75] font-normal mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
