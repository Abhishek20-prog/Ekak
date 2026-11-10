// Send a message to the global screen-reader live regions (see LiveRegions).
export function announce(message, { assertive = false } = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app:announce", { detail: { message, assertive } }));
}

