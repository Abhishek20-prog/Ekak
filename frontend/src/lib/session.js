import "server-only";
import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";

const COOKIE_NAME = "session";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const password = process.env.SESSION_PASSWORD;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_PASSWORD must be set to a string of at least 32 characters (see .env.example).",
    );
  }
  return password;
}

export async function createSession(userId) {
  const sealed = await sealData({ userId }, { password: secret(), ttl: TTL_SECONDS });
  (await cookies()).set(COOKIE_NAME, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function getSession() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return {};
  try {
    return await unsealData(value, { password: secret(), ttl: TTL_SECONDS });
  } catch {
    return {}; // tampered or expired
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

