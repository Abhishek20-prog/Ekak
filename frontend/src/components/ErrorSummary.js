"use client";

import { useEffect, useRef } from "react";

// Moves focus to a summary of problems after a failed submit, with accessible links to each field.
export default function ErrorSummary({ state, labels = {} }) {
  const ref = useRef(null);
  const entries = Object.entries(state?.errors ?? {}).filter(([, messages]) => messages?.length);
  const hasProblem = !state?.ok && (entries.length > 0 || Boolean(state?.message));

  useEffect(() => {
    if (hasProblem) {
      ref.current?.focus();
    }
  }, [state, hasProblem]);

  if (!hasProblem) return null;

  const title =
    entries.length === 0
      ? "Please correct the errors below"
      : entries.length === 1
        ? "There is 1 problem with your answers"
        : `There are ${entries.length} problems with your answers`;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="group"
      aria-labelledby="error-summary-title"
      className="rounded-2xl border-2 border-rose-500 bg-rose-500/10 p-5 text-rose-950 dark:text-rose-200 shadow-md focus:outline-none focus:ring-4 focus:ring-rose-500/30 animate-fade-up space-y-2.5"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">
          ⚠️
        </span>
        <h2 id="error-summary-title" className="text-base sm:text-lg font-black tracking-tight text-rose-800 dark:text-rose-300">
          {title}
        </h2>
      </div>

      {state.message && (
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
          {state.message}
        </p>
      )}

      {entries.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-sm font-medium">
          {entries.map(([field, messages]) => (
            <li key={field}>
              <a
                href={`#${field}`}
                className="underline hover:text-rose-950 dark:hover:text-white font-bold"
              >
                {labels[field] ?? field}: {messages[0]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
