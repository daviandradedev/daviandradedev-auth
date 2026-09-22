"use client";

import React, { createContext, useContext, useState } from "react";
import { persistLanguage } from "@/lib/language";
import { translations, type Language } from "@/lib/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function readPath(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

type LanguageProviderProps = {
  children: React.ReactNode;
  initialLanguage?: Language | null;
};

export function LanguageProvider({ children, initialLanguage = null }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? "en");

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    persistLanguage(lang);
  };

  const t = (path: string) => readPath(translations[language], path);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
