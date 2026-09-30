import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function originMatches(origin: string, parsed: URL) {
  try {
    const trusted = new URL(origin);
    if (trusted.protocol !== parsed.protocol) return false;
    if (trusted.hostname.startsWith("*.")) {
      const suffix = trusted.hostname.slice(2);
      return parsed.hostname.endsWith(`.${suffix}`);
    }
    return trusted.origin === parsed.origin;
  } catch {
    return false;
  }
}

function callbackUrl(url: string | null | undefined, trustedOrigins: string[]) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!trustedOrigins.some((origin) => originMatches(origin, parsed))) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isSafeCallbackUrl(url: string | null | undefined, trustedOrigins: string[]) {
  return callbackUrl(url, trustedOrigins) !== null;
}

export function externalHandoffUrl(
  callbackURL: string | undefined,
  hubOrigin: string,
  trustedOrigins: string[],
) {
  const target = callbackUrl(callbackURL, trustedOrigins);
  if (!target || target.origin === hubOrigin) return null;
  return target;
}
