import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { getUserWithProfile } from "./profile-service";

// Data Access Layer: the one place that turns a cookie into a user.
// Components using these must render inside <Suspense> (Cache Components requirement).

export async function getCurrentUser() {
  const { userId } = await getSession();
  if (!userId) return null;
  return getUserWithProfile(userId);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
