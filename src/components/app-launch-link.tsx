"use client";

import { useState } from "react";
import { redirectToExternalApp } from "@/lib/auth-redirect";
import { useLanguage } from "@/lib/contexts/language-context";
import type { PortfolioApp } from "@/lib/apps";

type AppLaunchLinkProps = {
  app: PortfolioApp;
  index?: number;
};

export function AppLaunchLink({ app, index = 0 }: AppLaunchLinkProps) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLaunch() {
    setErrorMsg("");
    setLoading(true);
    const ok = await redirectToExternalApp(app.href);
    if (!ok) {
      setLoading(false);
      setErrorMsg(t("account.ssoHandoffFailed"));
    }
  }

  return (
    <li style={{ ["--stagger" as string]: `${index * 60}ms` }}>
      <button
        type="button"
        className={`app-card app-card--${app.id}`}
        onClick={() => void handleLaunch()}
        disabled={loading}
        aria-busy={loading || undefined}
        aria-label={`${t(app.nameKey)} — ${app.description[language]}`}
      >
        <div className="app-card-body">
          <p className="app-card-name">{t(app.nameKey)}</p>
          <p className="app-card-desc">{app.description[language]}</p>
          {errorMsg ? (
            <p className="app-link-error" role="alert">
              {errorMsg}
            </p>
          ) : null}
        </div>
        <span className="app-card-arrow" aria-hidden="true">
          {loading ? "…" : "→"}
        </span>
      </button>
    </li>
  );
}
