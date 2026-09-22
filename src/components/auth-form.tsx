"use client";

import { FormEvent, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { redirectToExternalApp } from "@/lib/auth-redirect";
import { useLanguage } from "@/lib/contexts/language-context";
import { isSafeCallbackUrl } from "@/lib/utils";
import { trustedOrigins } from "@/lib/auth-public";

export function AuthForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const titleId = `${formId}-title`;
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;
  const passwordHintId = `${formId}-password-hint`;
  const errorId = `${formId}-error`;
  const statusId = `${formId}-status`;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; password?: boolean }>({});

  const callbackURL = (() => {
    const raw = searchParams.get("callbackURL");
    return isSafeCallbackUrl(raw, trustedOrigins) ? raw! : "/account";
  })();

  function validateFields() {
    const next = { email: !email.trim(), password: password.length < 8 };
    setFieldErrors(next);
    return !next.email && !next.password;
  }

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!validateFields()) {
      setErrorMsg(t("auth.formInvalidMsg"));
      emailRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || email,
          callbackURL,
        });

        if (error) {
          const msg = error.message?.toLowerCase() ?? "";
          if (msg.includes("already") || msg.includes("exists")) setErrorMsg(t("auth.emailExistsMsg"));
          else if (msg.includes("password")) {
            setErrorMsg(t("auth.weakPasswordMsg"));
            setFieldErrors({ password: true });
          } else setErrorMsg(error.message || t("auth.genericErrorMsg"));
          emailRef.current?.focus();
          return;
        }

        setInfoMsg(t("auth.verifyEmailPending"));
        return;
      }

      const { error } = await authClient.signIn.email({ email, password, callbackURL });
      if (error) {
        const notVerified =
          error.status === 403 ||
          error.code === "EMAIL_NOT_VERIFIED" ||
          error.message?.toLowerCase().includes("verify");
        if (notVerified) {
          setInfoMsg(t("auth.emailNotVerifiedMsg"));
          return;
        }

        const authFailure =
          error.status === 401 ||
          error.code === "INVALID_EMAIL_OR_PASSWORD" ||
          error.code === "INVALID_CREDENTIALS";
        setErrorMsg(authFailure ? t("auth.wrongCredentialsMsg") : t("auth.genericErrorMsg"));
        setFieldErrors({ email: true, password: true });
        emailRef.current?.focus();
        return;
      }

      if (callbackURL.startsWith("http")) {
        await redirectToExternalApp(callbackURL);
        return;
      }
      router.push(callbackURL);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const describedBy = [passwordHintId, errorMsg ? errorId : undefined].filter(Boolean).join(" ");

  return (
    <section aria-labelledby={titleId} className="auth-card">
      <div className="auth-card-head">
        <h2 id={titleId} className="auth-card-title">
          {isSignUp ? t("auth.createAccount") : t("auth.welcome")}
        </h2>
        <p className="auth-card-subtitle">
          {isSignUp ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
        </p>
      </div>

      <div id={statusId} aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? t("auth.loading") : ""}
      </div>

      <form
        onSubmit={handleAuth}
        className={isSignUp ? "form-stack form-stack--signup" : "form-stack"}
        noValidate
        aria-describedby={describedBy || undefined}
      >
        {isSignUp && (
          <div className="form-field">
            <label htmlFor={nameId} className="form-label">
              {t("auth.namePlaceholder")}
            </label>
            <input id={nameId} name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
          </div>
        )}

        <div className="form-field">
          <label htmlFor={emailId} className="form-label">
            {t("auth.emailPlaceholder")}
            {isSignUp && <span className="form-label-hint">{t("auth.emailIdentityHint")}</span>}
          </label>
          <input
            ref={emailRef}
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: false }));
            }}
            aria-invalid={fieldErrors.email || undefined}
            aria-describedby={errorMsg ? errorId : undefined}
            required
            className={`form-input${fieldErrors.email ? " is-invalid" : ""}`}
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor={passwordId} className="form-label">
            {t("auth.passwordPlaceholder")}
            <span id={passwordHintId} className="form-label-hint">
              {t("auth.passwordHint")}
            </span>
          </label>
          <div className="form-input-wrap">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: false }));
              }}
              aria-invalid={fieldErrors.password || undefined}
              aria-describedby={describedBy || undefined}
              required
              minLength={8}
              className={`form-input${fieldErrors.password ? " is-invalid" : ""}`}
            />
            <button
              type="button"
              className="form-input-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              aria-pressed={showPassword}
              aria-controls={passwordId}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {!isSignUp ? (
            <p className="form-field-action">
              <Link href="/forgot-password" className="btn-link btn-link--inline">
                {t("auth.forgotPassword")}
              </Link>
            </p>
          ) : null}
        </div>

        {errorMsg ? (
          <p id={errorId} role="alert" className="form-error">
            {errorMsg}
          </p>
        ) : null}
        {infoMsg ? (
          <p role="status" className="form-success">
            {infoMsg}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading ? true : undefined}
          aria-busy={loading || undefined}
          aria-describedby={loading ? statusId : undefined}
          className="btn-primary"
        >
          {loading ? t("auth.loading") : isSignUp ? t("auth.signUpButton") : t("auth.signInButton")}
        </button>
      </form>

      <div className="auth-card-footer">
        <button
          type="button"
          className="btn-link"
          onClick={() => {
            setIsSignUp((v) => !v);
            setErrorMsg("");
            setInfoMsg("");
            setFieldErrors({});
          }}
        >
          {isSignUp ? t("auth.toggleToSignIn") : t("auth.toggleToSignUp")}
        </button>
      </div>
    </section>
  );
}
