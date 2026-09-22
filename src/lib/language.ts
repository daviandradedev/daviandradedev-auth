import type { Language } from "@/lib/translations";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function readLanguageCookieValue(value: string | undefined): Language | null {
  return value === "en" || value === "pt" ? value : null;
}

export function persistLanguage(language: Language) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("language", language);
    document.cookie = `language=${language};path=/;max-age=${ONE_YEAR};SameSite=Lax`;
    document.documentElement.lang = language;
  } catch {
  }
}
