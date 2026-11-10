import { NextResponse } from "next/server";
import { setPrefsCookie } from "@/lib/a11y-prefs";
import { fieldErrors, ProfilePatchSchema } from "@/lib/definitions";
import { getUserWithProfile, updateUserProfile } from "@/lib/profile-service";
import { getSession } from "@/lib/session";

// JSON API for the profile, handy for a mobile app or other clients.
// Auth is the same encrypted session cookie the web UI uses.

async function authedUserId() {
  const { userId } = await getSession();
  return userId ?? null;
}

const unauthorized = () => NextResponse.json({ error: "Not signed in." }, { status: 401 });

export async function GET() {
  const userId = await authedUserId();
  if (!userId) return unauthorized();
  const user = getUserWithProfile(userId);
  if (!user) return unauthorized();
  return NextResponse.json({ user });
}

export async function PATCH(request) {
  const userId = await authedUserId();
  if (!userId) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON." }, { status: 400 });
  }

  const parsed = ProfilePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }

  updateUserProfile(userId, parsed.data);
  const user = getUserWithProfile(userId);
  await setPrefsCookie(user.profile);
  return NextResponse.json({ user });
}
