"use client";

import { useEffect } from "react";
import { appNameKeyForHref } from "@/lib/apps";
import { redirectToExternalApp } from "@/lib/auth-redirect";
import { useLanguage } from "@/lib/contexts/language-context";

export function openingTitle(callbackURL: string, t: (path: string) => string) {
  const nameKey = appNameKeyForHref(callbackURL);
  const name = nameKey ? t(nameKey) : "";
  return name ? t("redirect.openingNamed").replaceAll("{name}", name) : t("redirect.opening");
}

export function showRedirectScreen(title: string) {
  if (typeof document === "undefined") return;
  let root = document.getElementById("redirect-screen");
  if (!root) {
    root = document.createElement("div");
    root.id = "redirect-screen";
    root.className = "redirect-screen";
    root.setAttribute("role", "status");
    root.setAttribute("aria-live", "polite");
    const spinner = document.createElement("div");
    spinner.className = "redirect-spinner";
    spinner.setAttribute("aria-hidden", "true");
    const label = document.createElement("p");
    label.className = "redirect-title";
    root.append(spinner, label);
    document.body.append(root);
  }
  const label = root.querySelector(".redirect-title");
  if (label) label.textContent = title;
}

export function RedirectScreen({ title }: { title: string }) {
  return (
    <div className="redirect-screen" role="status" aria-live="polite">
      <div className="redirect-spinner" aria-hidden="true" />
      <p className="redirect-title">{title}</p>
    </div>
  );
}

export function ContinueRedirect({ nextPath }: { nextPath: string }) {
  const { t } = useLanguage();

  useEffect(() => {
    window.location.replace(nextPath);
  }, [nextPath]);

  return <RedirectScreen title={t("redirect.returning")} />;
}

export function ExternalRedirect({ callbackURL }: { callbackURL: string }) {
  const { t } = useLanguage();

  useEffect(() => {
    void redirectToExternalApp(callbackURL);
  }, [callbackURL]);

  return <RedirectScreen title={openingTitle(callbackURL, t)} />;
}
