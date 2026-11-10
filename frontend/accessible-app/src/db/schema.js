import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const profiles = sqliteTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio").notNull().default(""),
  location: text("location").notNull().default(""),
  locale: text("locale").notNull().default("en"),
  // Accessibility preferences, stored per user so they follow them across devices.
  screenReaderOptimized: integer("screen_reader_optimized", { mode: "boolean" })
    .notNull()
    .default(false),
  readAloudEnabled: integer("read_aloud_enabled", { mode: "boolean" })
    .notNull()
    .default(false),
  speechRate: real("speech_rate").notNull().default(1),
  fontScale: integer("font_scale").notNull().default(100),
  highContrast: integer("high_contrast", { mode: "boolean" })
    .notNull()
    .default(false),
  reducedMotion: integer("reduced_motion", { mode: "boolean" })
    .notNull()
    .default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
