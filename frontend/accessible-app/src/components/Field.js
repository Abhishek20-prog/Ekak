// Label + hint + error wired to the control with for/id and aria-describedby,
// so screen readers announce "Email, edit text, required, <hint>, <error>".
export function Field({ id, name, label, hint, error, required, as: Control = "input", children, ...rest }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="req"> (required)</span>}
      </label>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      {error && (
        <p id={errorId} className="error">
          <span className="sr-only">Error: </span>
          {error}
        </p>
      )}
      <Control
        id={id}
        name={name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {children}
      </Control>
    </div>
  );
}

export function Check({ id, name, label, hint, defaultChecked }) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="check">
      <input id={id} name={name ?? id} type="checkbox" defaultChecked={defaultChecked} aria-describedby={hintId} />
      <div>
        <label htmlFor={id}>{label}</label>
        {hint && <p id={hintId} className="hint">{hint}</p>}
      </div>
    </div>
  );
}
