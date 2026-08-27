import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSafeCallbackUrl(url: string | null | undefined, trustedOrigins: string[]) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return trustedOrigins.some((origin) => {
      try {
        return new URL(origin).origin === parsed.origin;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}
