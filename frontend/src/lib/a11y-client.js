// Browser-only helpers for the display-preferences cookie (see src/lib/a11y-prefs.js).
const PREFS_EVENT = "app:prefs";

export function readPrefsRaw() {
  const match = document.cookie.match(/(?:^|; )a11y=([^;]*)/);
  return match ? match[1] : "";
}

export function parsePrefs(raw) {
  try {
    return raw ? JSON.parse(decodeURIComponent(raw)) : {};
  } catch {
    return {};
  }
}

export function subscribePrefs(callback) {
  window.addEventListener(PREFS_EVENT, callback);
  return () => window.removeEventListener(PREFS_EVENT, callback);
}

// Apply saved preferences to the page immediately (no reload needed).
export function applyPrefs({ highContrast, reducedMotion, fontScale, screenReaderOptimized }) {
  const root = document.documentElement;
  const set = (key, value) => (value ? (root.dataset[key] = value) : delete root.dataset[key]);
  set("contrast", highContrast ? "high" : "");
  set("motion", reducedMotion ? "reduce" : "");
  set("fontScale", fontScale && fontScale !== 100 ? String(fontScale) : "");
  set("sr", screenReaderOptimized ? "on" : "");
  window.dispatchEvent(new Event(PREFS_EVENT));
}

