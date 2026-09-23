"use client";

import { useLanguage } from "@/lib/contexts/language-context";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="auth-page">
      <section className="auth-card not-found-card" aria-labelledby="not-found-title">
        <p className="hero-eyebrow">{t("notFound.code")}</p>
        <h1 id="not-found-title" className="not-found-title">
          {t("notFound.title")}
        </h1>
        <p className="auth-card-subtitle">{t("notFound.message")}</p>
        <a href="/" className="btn-primary">
          {t("notFound.back")}
        </a>
      </section>
    </div>
  );
}
