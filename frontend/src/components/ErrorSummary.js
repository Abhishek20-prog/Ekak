"use client";

import { useEffect, useRef } from "react";

// Moves focus to a summary of problems after a failed submit, with links to each field.
export default function ErrorSummary({ state, labels = {} }) {
  const ref = useRef(null);
  const entries = Object.entries(state?.errors ?? {}).filter(([, messages]) => messages?.length);
  const hasProblem = !state?.ok && (entries.length > 0 || Boolean(state?.message));

  useEffect(() => {
    if (hasProblem) ref.current?.focus();
  }, [state, hasProblem]);

  if (!hasProblem) return null;

  const title =
    entries.length === 0
      ? "Something went wrong"
      : entries.length === 1
        ? "There is 1 problem with your answers"
        : `There are ${entries.length} problems with your answers`;

  return (
    <div ref={ref} tabIndex={-1} role="group" aria-labelledby="error-summary-title" className="error-summary">
      <h2 id="error-summary-title">{title}</h2>
      {state.message && <p>{state.message}</p>}
      {entries.length > 0 && (
        <ul>
          {entries.map(([field, messages]) => (
            <li key={field}>
              <a href={`#${field}`}>{labels[field] ?? field}: {messages[0]}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
