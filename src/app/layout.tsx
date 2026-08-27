import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { LanguageToggle } from "@/components/language-toggle";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "daviandrade.dev Auth",
  description: "Single sign-on for daviandrade.dev portfolio apps",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
            <a href="/" className="text-sm font-semibold tracking-wide text-zinc-200">
              daviandrade.dev
            </a>
            <LanguageToggle />
          </header>
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
