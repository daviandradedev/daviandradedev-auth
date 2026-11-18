import { betterAuth } from "better-auth";
import { bearer, oneTimeToken } from "better-auth/plugins";
import { Pool } from "pg";
import { headers } from "next/headers";

const pool = new Pool({ connectionString: process.env.AUTH_DATABASE_URL });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const authHubUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3100";

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: appUrl,
  trustedOrigins: [
    authHubUrl,
    appUrl,
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
  ]
    .map((origin) => origin.trim())
    .filter(Boolean),
  advanced: process.env.BETTER_AUTH_COOKIE_DOMAIN
    ? {
        crossSubDomainCookies: {
          enabled: true,
          domain: process.env.BETTER_AUTH_COOKIE_DOMAIN,
        },
      }
    : undefined,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [bearer(), oneTimeToken()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
