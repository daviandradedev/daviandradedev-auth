"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/lib/contexts/language-context";

export function ForgotPasswordPanel() {
  const { t } = useLanguage();
  const formId = useId();
  const emailId = `${formId}-email`;
  const errorId = `${formId}-error`;
  const successId = `${formId}-success`;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) {
      setErrorMsg(t("auth.formInvalidMsg"));
      return;
    }

    setLoading(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo,
    });
    setLoading(false);

    if (error) {
      setErrorMsg(t("auth.genericErrorMsg"));
      return;
    }

    setSuccessMsg(t("auth.resetEmailSent"));
  }

  return (
    <section className="auth-card">
      <div className="auth-card-head">
        <h2 className="auth-card-title">{t("auth.forgotPasswordTitle")}</h2>
        <p className="auth-card-subtitle">{t("auth.forgotPasswordSubtitle")}</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor={emailId} className="form-label">
            {t("auth.emailPlaceholder")}
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            aria-describedby={errorMsg ? errorId : successMsg ? successId : undefined}
          />
        </div>

        {errorMsg ? (
          <p id={errorId} role="alert" className="form-error">
            {errorMsg}
          </p>
        ) : null}
        {successMsg ? (
          <p id={successId} role="status" className="form-success">
            {successMsg}
          </p>
        ) : null}

        <button type="submit" className="btn-primary" disabled={loading || undefined} aria-busy={loading || undefined}>
          {loading ? t("auth.loading") : t("auth.sendResetLink")}
        </button>
      </form>

      <div className="auth-card-footer">
        <Link href="/" className="btn-link">
          {t("auth.backToSignIn")}
        </Link>
      </div>
    </section>
  );
}
