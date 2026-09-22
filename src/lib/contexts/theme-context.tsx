"use client";

import React, { createContext, useContext, useState } from "react";
import { persistTheme } from "@/lib/theme";

export type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
  initialTheme?: Theme | null;
};

export function ThemeProvider({ children, initialTheme = null }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme ?? "light");

  const setTheme = (next: Theme) => {
    setThemeState(next);
    persistTheme(next);
  };

  const toggleTheme = () => {
    setThemeState((current) => {
      const next = current === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
