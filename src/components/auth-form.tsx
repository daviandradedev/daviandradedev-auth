"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/lib/contexts/language-context";
import { isSafeCallbackUrl } from "@/lib/utils";
import { trustedOrigins } from "@/lib/auth-public";

export function AuthForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const callbackURL = useMemo(() => {
    const raw = searchParams.get("callbackURL");
    if (isSafeCallbackUrl(raw, trustedOrigins)) return raw!;
    return "/account";
  }, [searchParams]);

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isSignUp) {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: name.trim() || email.split("@")[0] || email,
        callbackURL,
      });

      if (error) {
        const errorStr = error.message?.toLowerCase() ?? "";
        if (errorStr.includes("already") || errorStr.includes("exists")) {
          setErrorMsg(t("auth.emailExistsMsg"));
        } else if (errorStr.includes("password")) {
          setErrorMsg(t("auth.weakPasswordMsg"));
        } else {
          setErrorMsg(error.message || "Error");
        }
        setLoading(false);
        return;
      }
    } else {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL,
      });
      if (error) {
        setErrorMsg(t("auth.wrongCredentialsMsg"));
        setLoading(false);
        return;
      }
    }

    if (callbackURL.startsWith("http")) {
      window.location.href = callbackURL;
      return;
    }
    router.push(callbackURL);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">
      <div className="mb-6 flex flex-col items-center space-y-2 text-center">
        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <KeyRound size={28} />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          {isSignUp ? t("auth.createAccount") : t("auth.welcome")}
        </h1>
        <p className="text-sm text-zinc-400">
          {isSignUp ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-3" autoComplete="off">
        {isSignUp && (
          <input
            type="text"
            placeholder={t("auth.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-emerald-500/50"
          />
        )}
        <input
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-emerald-500/50"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-4 pr-12 text-sm text-white outline-none transition focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errorMsg && <p className="text-center text-xs font-medium text-red-400">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold tracking-wide text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? t("auth.loading") : isSignUp ? t("auth.signUpButton") : t("auth.signInButton")}
        </button>
      </form>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp((v) => !v);
            setErrorMsg("");
          }}
          className="text-xs font-semibold text-zinc-500 transition hover:text-emerald-400"
        >
          {isSignUp ? t("auth.toggleToSignIn") : t("auth.toggleToSignUp")}
        </button>
      </div>
    </div>
  );
}
