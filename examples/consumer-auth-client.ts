/**
 * Drop into each portfolio app (seriesaholic, work-schedule, ...).
 * Point the client at the central auth hub — do NOT create a second user table.
 */
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3100",
});

/** Redirect user to central login, then back to this app. */
export function goToLogin(callbackURL = typeof window !== "undefined" ? window.location.origin : "/") {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3100";
  const url = new URL(authUrl);
  url.searchParams.set("callbackURL", callbackURL);
  window.location.href = url.toString();
}
