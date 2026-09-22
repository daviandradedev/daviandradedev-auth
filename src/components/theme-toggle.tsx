"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/contexts/theme-context";
import { useLanguage } from "@/lib/contexts/language-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="preference-toggle"
      role="switch"
      aria-checked={isDark}
      title={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      onClick={toggleTheme}
    >
      <span className="preference-thumb" data-state={isDark ? "right" : "left"} aria-hidden="true" />
      <span className="preference-labels" aria-hidden="true">
        <span className="preference-mark">
          <Sun size={16} className="preference-icon-sun" aria-hidden="true" />
        </span>
        <span className="preference-mark">
          <Moon size={16} className={isDark ? "preference-icon-moon" : "preference-icon-muted"} aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
