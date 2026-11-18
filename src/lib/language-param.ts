import type { Language } from "@/lib/translations";

export const LANGUAGE_PARAM = "lang";

export function languageFromParam(value: string | null | undefined): Language | null {
  return value === "pt" || value === "en" ? value : null;
}

export function languageCookieDomain(hostname: string) {
  return hostname === "daviandrade.dev" || hostname.endsWith(".daviandrade.dev")
    ? ".daviandrade.dev"
    : undefined;
}
