import { betterAuth } from "better-auth";
import { bearer, oneTimeToken } from "better-auth/plugins";
import { normalizeAuthEmail } from "@/lib/auth-policy";
import { pool } from "@/lib/db";
import { sendAuthLinkEmail } from "@/lib/mail/resend";

function toHttpsOrigin(host?: string) {
  const value = host?.trim();
  if (!value) return undefined;
  return value.startsWith("http") ? value : `https://${value}`;
}

export const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  toHttpsOrigin(process.env.VERCEL_URL),
  toHttpsOrigin(process.env.VERCEL_BRANCH_URL),
  toHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  "https://*.daviandrade.dev",
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin));

const cookieDomain = process.env.BETTER_AUTH_COOKIE_DOMAIN?.trim();

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  advanced: cookieDomain
    ? { crossSubDomainCookies: { enabled: true, domain: cookieDomain } }
    : undefined,
  user: {
    additionalFields: {
      receivesNewsletter: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendAuthLinkEmail(user.email, `Approve email change to ${newEmail}`, url);
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthLinkEmail(user.email, "Verify your daviandrade.dev account", url);
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthLinkEmail(user.email, "Reset your password", url);
    },
  },
  plugins: [bearer(), oneTimeToken()],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = normalizeAuthEmail(user.email);
          return { data: { ...user, email, id: email } };
        },
      },
    },
  },
});
