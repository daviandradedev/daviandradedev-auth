"use client";

import { useLanguage } from "@/lib/contexts/language-context";

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <div className="auth-hero">
      <p className="hero-eyebrow">{t("home.ssoLabel")}</p>
      <h1 className="hero-title">{t("tagline")}</h1>
      <p className="hero-body">{t("home.ssoHint")}</p>
    </div>
  );
}
