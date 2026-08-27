/**
 * Server-side session check in a consumer app.
 * Prefer sharing the same DATABASE_URL (auth tables) + BETTER_AUTH_SECRET,
 * OR call the auth hub session endpoint with forwarded cookies (same-site / cookie domain).
 */
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { headers } from "next/headers";

const pool = new Pool({ connectionString: process.env.AUTH_DATABASE_URL });

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "").split(",").filter(Boolean),
  advanced: process.env.BETTER_AUTH_COOKIE_DOMAIN
    ? {
        crossSubDomainCookies: {
          enabled: true,
          domain: process.env.BETTER_AUTH_COOKIE_DOMAIN,
        },
      }
    : undefined,
  emailAndPassword: { enabled: true },
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
