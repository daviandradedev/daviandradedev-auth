"use client";

import { FormEvent, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
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
  const [receivesNewsletter, setReceivesNewsletter] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});

  const callbackURL = (() => {
    const raw = searchParams.get("callbackURL");
    return isSafeCallbackUrl(raw, trustedOrigins) ? raw! : "/account";
  })();

  function validateFields() {
    const next = { 
      name: isSignUp ? !name.trim() : false,
      email: !email.trim(), 
      password: password.length < 8 
    };
    setFieldErrors(next);
    return !next.name && !next.email && !next.password;
  }

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

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
          receivesNewsletter,
        });

        if (error) {
          const msg = error.message?.toLowerCase() ?? "";
          if (msg.includes("already") || msg.includes("exists")) {
            setErrorMsg(t("auth.emailExistsMsg"));
          } else if (msg.includes("password")) {
            setErrorMsg(t("auth.weakPasswordMsg"));
            setFieldErrors({ password: true });
          } else if (msg.includes("body.email") || msg.includes("invalid input")) {
            setErrorMsg(t("auth.invalidEmailFormatMsg"));
            setFieldErrors({ email: true });
          } else {
            setErrorMsg(error.message || t("auth.genericErrorMsg"));
          }
          emailRef.current?.focus();
          return;
        }

        toast.success(t("auth.verifyEmailPending"));
        return;
      }

      const { error } = await authClient.signIn.email({ email, password, callbackURL });
      if (error) {
        const msg = error.message?.toLowerCase() ?? "";
        const notVerified =
          error.status === 403 ||
          error.code === "EMAIL_NOT_VERIFIED" ||
          msg.includes("verify");
        
        if (notVerified) {
          toast.info(t("auth.emailNotVerifiedMsg"));
          return;
        }

        if (msg.includes("body.email") || msg.includes("invalid input")) {
          setErrorMsg(t("auth.invalidEmailFormatMsg"));
          setFieldErrors({ email: true });
          emailRef.current?.focus();
          return;
        }

        const authFailure =
          error.status === 401 ||
          error.code === "INVALID_EMAIL_OR_PASSWORD" ||
          error.code === "INVALID_CREDENTIALS";
          
        setErrorMsg(authFailure ? t("auth.wrongCredentialsMsg") : (error.message || t("auth.genericErrorMsg")));
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
        {!isSignUp && (
          <p className="auth-card-subtitle">
            {t("auth.signInSubtitle")}
          </p>
        )}
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
            <input 
              id={nameId} 
              name="name" 
              type="text" 
              autoComplete="name" 
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, name: false }));
              }} 
              required
              aria-invalid={fieldErrors.name || undefined}
              className={`form-input${fieldErrors.name ? " is-invalid" : ""}`} 
            />
          </div>
        )}

        <div className="form-field">
          <label htmlFor={emailId} className="form-label">
            {t("auth.emailPlaceholder")}
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

        {isSignUp && (
          <div className="form-field form-field--full form-field--check">
            <input
              type="checkbox"
              id="newsletterOptIn"
              className="form-check-input"
              checked={receivesNewsletter}
              onChange={(e) => setReceivesNewsletter(e.target.checked)}
            />
            <label htmlFor="newsletterOptIn" className="form-check-label">
              {t("auth.newsletterOptIn")}
            </label>
          </div>
        )}

        {errorMsg ? (
          <p id={errorId} role="alert" className="form-error">
            {errorMsg}
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
        <div className="auth-divider">
          {t("auth.orContinueWith")}
        </div>
        <div className="auth-social">
          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL })}
            className="btn-secondary btn-social"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "github", callbackURL })}
            className="btn-secondary btn-social"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            GitHub
          </button>
        </div>

        <button
          type="button"
          className="btn-link"
          onClick={() => {
            setIsSignUp((v) => !v);
            setErrorMsg("");
            setFieldErrors({});
          }}
        >
          {isSignUp ? t("auth.toggleToSignIn") : t("auth.toggleToSignUp")}
        </button>
      </div>
    </section>
  );
}
