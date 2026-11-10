import "server-only";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const SETUP_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    locale TEXT NOT NULL DEFAULT 'en',
    screen_reader_optimized INTEGER NOT NULL DEFAULT 0,
    read_aloud_enabled INTEGER NOT NULL DEFAULT 0,
    speech_rate REAL NOT NULL DEFAULT 1,
    font_scale INTEGER NOT NULL DEFAULT 100,
    high_contrast INTEGER NOT NULL DEFAULT 0,
    reduced_motion INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`;

function createDb() {
  const file = path.resolve(/* turbopackIgnore: true */ process.env.DATABASE_PATH || "./data/app.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(SETUP_SQL);
  return drizzle(sqlite, { schema });
}

// Lazy + cached on globalThis so dev hot-reload doesn't open many connections
// and importing this file at build time doesn't touch the disk.
export function getDb() {
  globalThis.__appDb ??= createDb();
  return globalThis.__appDb;
}

