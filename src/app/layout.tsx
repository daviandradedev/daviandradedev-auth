import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { Inter, Syne } from "next/font/google";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { getCurrentUser } from "@/lib/api/auth";
import { readLanguageCookieValue } from "@/lib/language";
import { LEGACY_PREFERENCE_MIGRATE_SCRIPT } from "@/lib/preference-migrate";
import { readThemeCookieValue } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "daviandrade.dev Auth",
  description: "Single sign-on for daviandrade.dev portfolio apps",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = readThemeCookieValue(cookieStore.get("theme")?.value);
  const initialLanguage = readLanguageCookieValue(cookieStore.get("language")?.value);
  const user = await getCurrentUser();
  const signedIn = Boolean(user);

  return (
    <html
      lang={initialLanguage ?? "en"}
      className={`${inter.variable} ${syne.variable} h-full${initialTheme === "dark" ? " dark" : ""}`}
    >
      <body className="app-shell">
        <Script id="legacy-preference-migrate" strategy="beforeInteractive">
          {LEGACY_PREFERENCE_MIGRATE_SCRIPT}
        </Script>
        <Providers initialTheme={initialTheme} initialLanguage={initialLanguage}>
          <SkipLink />
          <SiteHeader signedIn={signedIn} />
          <main id="main-content" tabIndex={-1} className="page-shell">
            {children}
          </main>
          <Footer signedIn={signedIn} />
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
