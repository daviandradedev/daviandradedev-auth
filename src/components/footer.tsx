"use client";

import { Mail } from "lucide-react";
import { useLanguage } from "@/lib/contexts/language-context";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-white/10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-4 px-4 py-5 md:grid-cols-3">
        <p className="text-center text-[11px] tracking-wide text-zinc-500 md:text-left">
          {t("brand")}
        </p>
        <p className="text-center text-[11px] tracking-wide text-zinc-500">
          {t("footer.credit")} {year}
        </p>
        <nav className="flex items-center justify-center gap-3.5 md:justify-end" aria-label="Social">
          <a
            href="https://linkedin.com/in/daviandradedev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition hover:text-blue-400"
            title="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="sr-only">LinkedIn</span>
          </a>
          <a
            href="https://github.com/daviandradedev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition hover:text-white"
            title="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="mailto:daviandrade.dev@gmail.com"
            className="text-zinc-500 transition hover:text-red-400"
            title="E-mail"
          >
            <Mail size={16} />
            <span className="sr-only">E-mail</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
