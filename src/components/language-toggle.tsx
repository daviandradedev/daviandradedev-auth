"use client";

import { useLanguage } from "@/lib/contexts/language-context";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const isPt = language === "pt";

  return (
    <button
      type="button"
      className="preference-toggle"
      role="switch"
      aria-checked={isPt}
      title={isPt ? t("language.ptFull") : t("language.enFull")}
      aria-label={isPt ? t("language.ptFull") : t("language.enFull")}
      onClick={() => setLanguage(isPt ? "en" : "pt")}
    >
      <span className="preference-thumb" data-state={isPt ? "right" : "left"} aria-hidden="true" />
      <span className="preference-labels" aria-hidden="true">
        <span className="preference-mark preference-mark-emoji">🇺🇸</span>
        <span className="preference-mark preference-mark-emoji">🇧🇷</span>
      </span>
    </button>
  );
}
