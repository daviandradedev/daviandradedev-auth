import type { Theme } from "@/lib/contexts/theme-context";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function readThemeCookieValue(value: string | undefined): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

export function persistTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme};path=/;max-age=${ONE_YEAR};SameSite=Lax`;
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
  }
}
