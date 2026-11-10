import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { profiles, users } from "@/db/schema";

export function findUserByEmail(email) {
  return getDb().select().from(users).where(eq(users.email, email)).get();
}

// Returns a safe, client-shaped object (never the password hash).
export function getUserWithProfile(userId) {
  const row = getDb()
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      bio: profiles.bio,
      location: profiles.location,
      locale: profiles.locale,
      screenReaderOptimized: profiles.screenReaderOptimized,
      readAloudEnabled: profiles.readAloudEnabled,
      speechRate: profiles.speechRate,
      fontScale: profiles.fontScale,
      highContrast: profiles.highContrast,
      reducedMotion: profiles.reducedMotion,
    })
    .from(users)
    .innerJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.id, userId))
    .get();
  if (!row) return null;
  const { id, name, email, createdAt, ...profile } = row;
  return { id, name, email, createdAt, profile };
}

export function createUser({ id, name, email, passwordHash, screenReaderOptimized }) {
  getDb().transaction((tx) => {
    tx.insert(users).values({ id, name, email, passwordHash }).run();
    tx.insert(profiles).values({ userId: id, screenReaderOptimized }).run();
  });
}

// `data` must already be validated. Name lives on users, everything else on profiles.
export function updateUserProfile(userId, data) {
  const { name, ...profileFields } = data;
  getDb().transaction((tx) => {
    if (name !== undefined) {
      tx.update(users).set({ name }).where(eq(users.id, userId)).run();
    }
    if (Object.keys(profileFields).length > 0) {
      tx.update(profiles)
        .set({ ...profileFields, updatedAt: new Date() })
        .where(eq(profiles.userId, userId))
        .run();
    }
  });
}

