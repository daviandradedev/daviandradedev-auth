"use client";

import { type MouseEvent } from "react";
import { useLanguage } from "@/lib/contexts/language-context";

export function SkipLink() {
  const { t } = useLanguage();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const main = document.getElementById("main-content");
    if (!main) return;
    main.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    main.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav aria-label={t("a11y.skipNavigation")}>
      <a href="#main-content" className="skip-link" onClick={handleClick}>
        {t("a11y.skipToContent")}
      </a>
    </nav>
  );
}
