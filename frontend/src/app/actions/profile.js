"use server";

import { redirect } from "next/navigation";
import { setPrefsCookie } from "@/lib/a11y-prefs";
import { fieldErrors, ProfileUpdateSchema } from "@/lib/definitions";
import { getUserWithProfile, updateUserProfile } from "@/lib/profile-service";
import { getSession } from "@/lib/session";

const on = (formData, key) => formData.get(key) === "on";

export async function updateProfile(_prev, formData) {
  // Re-check the session inside the action: never trust that the page was gated.
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const raw = {
    name: formData.get("name"),
    bio: formData.get("bio") ?? "",
    location: formData.get("location") ?? "",
    locale: formData.get("locale") ?? "en",
    screenReaderOptimized: on(formData, "screenReaderOptimized"),
    readAloudEnabled: on(formData, "readAloudEnabled"),
    speechRate: Number(formData.get("speechRate")),
    fontScale: Number(formData.get("fontScale")),
    highContrast: on(formData, "highContrast"),
    reducedMotion: on(formData, "reducedMotion"),
  };

  const parsed = ProfileUpdateSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: raw };

  updateUserProfile(userId, parsed.data);
  await setPrefsCookie(getUserWithProfile(userId).profile);
  return { ok: true, message: "Profile saved.", values: parsed.data };
}

