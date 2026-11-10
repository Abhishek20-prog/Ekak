import "server-only";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";

const COOKIE_NAME = "session";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Support current and development keys so cookies unseal reliably
function getPasswords() {
  const current =
    process.env.SESSION_PASSWORD ||
    "ekak_secret_session_encryption_key_at_least_32_characters_long";
  return {
    1: current,
    2: "ekak_local_dev_session_key_32_characters_minimum_secure",
    default: current,
  };
}

export async function createSession(userId) {
  try {
    const cookieStore = await cookies();
    const sealed = await sealData(
      { userId },
      { password: getPasswords(), ttl: TTL_SECONDS }
    );
    cookieStore.set(COOKIE_NAME, sealed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TTL_SECONDS,
    });
  } catch (err) {
    console.error("Failed to create session cookie:", err);
  }
}

export async function getSession() {
  try {
    // `connection()` opts this function out of static prerendering —
    // iron-session's unsealData uses Date.now() for TTL which changes per request
    await connection();
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return {};
    }

    const data = await unsealData(value, {
      password: getPasswords(),
      ttl: TTL_SECONDS,
    });

    if (!data || typeof data !== "object") {
      return {};
    }
    return data;
  } catch {
    // Expired, tampered, or mismatched session password — clear the bad cookie
    try {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_NAME);
    } catch {}
    return {};
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch {}
}
