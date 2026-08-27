import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  authPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

export function assertDatabaseConfigured() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }
}

export const pool =
  globalForDb.authPool ??
  new Pool({
    connectionString,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.authPool = pool;
}

export const db = drizzle(pool, { schema });
