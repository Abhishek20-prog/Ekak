import * as z from "zod";

export const FONT_SCALES = [100, 125, 150, 175, 200];

const trimmedLower = (v) => (typeof v === "string" ? v.trim().toLowerCase() : v);

const email = z.preprocess(
  trimmedLower,
  z.email({ error: "Enter a valid email address, like name@example.com." }),
);

// bcrypt only uses the first 72 bytes, so reject anything longer instead of silently truncating.
const password = z
  .string({ error: "Enter a password." })
  .min(8, { error: "Use at least 8 characters." })
  .refine((v) => new TextEncoder().encode(v).length <= 72, {
    error: "Use at most 72 characters.",
  });

const name = z
  .string({ error: "Enter your name." })
  .trim()
  .min(2, { error: "Enter your name (at least 2 characters)." })
  .max(80, { error: "Use at most 80 characters for your name." });

export const SignupSchema = z.object({
  name,
  email,
  password,
  screenReaderOptimized: z.boolean().default(false),
});

export const LoginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Enter your password." }),
});

export const PreferencesSchema = z.object({
  screenReaderOptimized: z.boolean(),
  readAloudEnabled: z.boolean(),
  speechRate: z
    .number({ error: "Speech speed must be a number." })
    .min(0.5, { error: "Speech speed must be between 0.5 and 2." })
    .max(2, { error: "Speech speed must be between 0.5 and 2." }),
  fontScale: z
    .number({ error: "Choose a text size." })
    .refine((v) => FONT_SCALES.includes(v), { error: "Choose a listed text size." }),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
});

export const ProfileUpdateSchema = z.object({
  name,
  bio: z.string().trim().max(500, { error: "Use at most 500 characters." }),
  location: z.string().trim().max(100, { error: "Use at most 100 characters." }),
  locale: z
    .string()
    .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, { error: "Use a language code like en or hi." }),
  ...PreferencesSchema.shape,
});

// For the JSON API: every field optional, unknown keys rejected.
export const ProfilePatchSchema = ProfileUpdateSchema.partial().strict();

export function fieldErrors(error) {
  return z.flattenError(error).fieldErrors;
}
