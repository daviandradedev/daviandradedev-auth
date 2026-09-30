"use client";

import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/lib/contexts/language-context";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const { t } = useLanguage();

  return (
    <header className="site-header" aria-label={t("a11y.siteHeader")}>
      <div className="site-header-inner">
        <a href="https://daviandrade.dev" className="brand-lockup">
          <BrandWordmark />
          <span className="sr-only">{t("brand")}</span>
        </a>
        <div className="preferences-bar" role="group" aria-label={t("a11y.preferencesToolbar")}>
          {signedIn ? (
            <Link href="/contact" className="header-nav-link">
              {t("contact.nav")}
            </Link>
          ) : null}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
