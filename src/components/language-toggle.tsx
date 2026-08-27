"use client";

import { useLanguage } from "@/lib/contexts/language-context";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-2.5 py-1 transition ${
          language === "en" ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"
        }`}
      >
        {t("language.en")}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        className={`rounded-full px-2.5 py-1 transition ${
          language === "pt" ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"
        }`}
      >
        {t("language.pt")}
      </button>
    </div>
  );
}
