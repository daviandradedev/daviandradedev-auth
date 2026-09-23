"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLaunchLink } from "@/components/app-launch-link";
import { AccountSettings } from "@/components/account-settings";
import { SignOutButton } from "@/components/sign-out-button";
import { initialsFromName } from "@/lib/avatar";
import { externalLinks, ssoApps } from "@/lib/apps";
import { useLanguage } from "@/lib/contexts/language-context";

type AccountViewProps = {
  user: {
    email: string;
    name: string;
    image?: string | null;
    emailVerified?: boolean;
    receivesNewsletter?: boolean | null;
  };
};

export function AccountView({ user }: AccountViewProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [view, setView] = useState<"home" | "settings">("home");
  const portfolio = externalLinks.find((link) => link.id === "portfolio");
  const soloApps = ssoApps.filter((app) => !app.pair);
  const asebiliApps = ssoApps.filter((app) => app.pair === "asebili");

  if (view === "settings") {
    return (
      <div className="account-panel">
        <AccountSettings
          key={`${user.email}:${user.name}:${user.image ?? ""}:${user.emailVerified ? "1" : "0"}`}
          user={user}
          onBack={() => {
            setView("home");
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="account-panel account-panel--home">
      <header className="account-masthead">
        <div className="account-masthead-identity">
          <div className="profile-avatar profile-avatar--lg" aria-hidden={user.image ? undefined : true}>
            {user.image ? (
              <img src={user.image} alt="" className="profile-avatar-img" />
            ) : (
              <span className="profile-avatar-fallback">{initialsFromName(user.name)}</span>
            )}
          </div>
          <div className="account-masthead-copy">
            <p className="account-kicker">{t("account.signedInAs")}</p>
            <h1 className="account-title">{user.name}</h1>
            <p className="account-email">{user.email}</p>
          </div>
        </div>
        <div className="account-header-actions">
          <button type="button" className="btn-ghost" onClick={() => setView("settings")}>
            {t("account.settings")}
          </button>
          <SignOutButton />
        </div>
      </header>

      <div className="account-bento">
        {portfolio ? (
          <a
            href={portfolio.href}
            className="portfolio-spotlight account-bento-hero"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(portfolio.nameKey)} — ${portfolio.description[language]}. ${t("a11y.opensInNewTab")}`}
          >
            <div className="portfolio-spotlight-copy">
              <p className="portfolio-spotlight-eyebrow">{t("account.portfolioEyebrow")}</p>
              <h2 className="portfolio-spotlight-title">{t(portfolio.nameKey)}</h2>
              <p className="portfolio-spotlight-desc">{portfolio.description[language]}</p>
            </div>
            <span className="portfolio-spotlight-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ) : null}

        <section aria-labelledby="connected-apps-heading" className="account-section account-bento-apps">
          <div className="account-section-head">
            <h2 id="connected-apps-heading" className="account-section-title">
              {t("account.apps")}
            </h2>
          </div>
          <ul className="account-app-grid">
            {soloApps.map((app, index) => (
              <AppLaunchLink key={app.id} app={app} index={index} />
            ))}
            {asebiliApps.length > 0 ? (
              <li style={{ ["--stagger" as string]: `${soloApps.length * 60}ms` }}>
                <div className="app-pair" role="group" aria-label="Asebili">
                  {asebiliApps.map((app) => (
                    <AppLaunchLink key={app.id} app={app} variant="split" />
                  ))}
                </div>
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
