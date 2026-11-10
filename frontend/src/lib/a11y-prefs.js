import "server-only";
import { cookies } from "next/headers";

// A small, NON-sensitive cookie that mirrors the user's display preferences.
// It is readable by JavaScript on purpose: an inline script in <head> applies it before
// first paint (no flash of the wrong text size/contrast), even on pages with no session read.
export const PREFS_COOKIE = "a11y";

export function prefsFromProfile(profile) {
  return {
    sr: profile.screenReaderOptimized,
    ra: profile.readAloudEnabled,
    rate: profile.speechRate,
    fs: profile.fontScale,
    hc: profile.highContrast,
    rm: profile.reducedMotion,
  };
}

export async function setPrefsCookie(profile) {
  // cookies().set() URL-encodes the value itself; the client decodes it with decodeURIComponent.
  (await cookies()).set(PREFS_COOKIE, JSON.stringify(prefsFromProfile(profile)), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearPrefsCookie() {
  (await cookies()).delete(PREFS_COOKIE);
}

