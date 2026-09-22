import pg from "pg";

export async function markUserEmailVerified(email: string) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database test helpers");
  }

  const pool = new pg.Pool({ connectionString });
  try {
    await pool.query('UPDATE "user" SET "emailVerified" = true WHERE email = $1', [email.toLowerCase()]);
  } finally {
    await pool.end();
  }
}
