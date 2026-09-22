"use client";

import { LanguageProvider } from "@/lib/contexts/language-context";
import { ThemeProvider, type Theme } from "@/lib/contexts/theme-context";
import type { Language } from "@/lib/translations";

type ProvidersProps = {
  children: React.ReactNode;
  initialTheme?: Theme | null;
  initialLanguage?: Language | null;
};

export function Providers({ children, initialTheme = null, initialLanguage = null }: ProvidersProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <LanguageProvider initialLanguage={initialLanguage}>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
