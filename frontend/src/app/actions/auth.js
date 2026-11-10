"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { clearPrefsCookie, setPrefsCookie } from "@/lib/a11y-prefs";
import { fieldErrors, LoginSchema, SignupSchema } from "@/lib/definitions";
import { createUser, findUserByEmail, getUserWithProfile } from "@/lib/profile-service";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { createSession, deleteSession } from "@/lib/session";

// Real hash of a random value, built once. Lets us spend the same time on
// "no such user" as on "wrong password" so response timing doesn't reveal which emails exist.
let dummyHashPromise;
function getDummyHash() {
  dummyHashPromise ??= bcrypt.hash(randomUUID(), 12);
  return dummyHashPromise;
}

export async function signup(_prev, formData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    screenReaderOptimized: formData.get("screenReaderOptimized") === "on",
  };
  const values = { name: String(raw.name ?? ""), email: String(raw.email ?? ""), screenReaderOptimized: raw.screenReaderOptimized };

  const parsed = SignupSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { name, email, password, screenReaderOptimized } = parsed.data;
  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    createUser({ id, name, email, passwordHash, screenReaderOptimized });
  } catch (err) {
    if (err?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return { errors: { email: ["An account with this email already exists. Try logging in instead."] }, values };
    }
    console.error("signup failed", err);
    return { message: "We couldn't create your account. Please try again.", values };
  }

  await createSession(id);
  await setPrefsCookie(getUserWithProfile(id).profile);
  redirect("/home");
}

export async function login(_prev, formData) {
  const raw = { email: formData.get("email"), password: formData.get("password") };
  const values = { email: String(raw.email ?? "") };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { email, password } = parsed.data;
  const limitKey = `login:${email}`;
  const limit = rateLimit(limitKey);
  if (!limit.ok) {
    return {
      message: `Too many attempts. Please wait about ${limit.retryAfterMinutes} minute(s) and try again.`,
      values,
    };
  }

  const user = findUserByEmail(email);
  const valid = await bcrypt.compare(password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !valid) {
    return { message: "Incorrect email or password.", values };
  }

  resetRateLimit(limitKey);
  await createSession(user.id);
  await setPrefsCookie(getUserWithProfile(user.id).profile);
  redirect("/home");
}

export async function logout() {
  await deleteSession();
  await clearPrefsCookie();
  redirect("/");
}

