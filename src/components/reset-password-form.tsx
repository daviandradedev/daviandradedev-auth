"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/lib/contexts/language-context";

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const formId = useId();
  const passwordId = `${formId}-password`;
  const errorId = `${formId}-error`;
  const successId = `${formId}-success`;

  const tokenError = searchParams.get("error");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!token) {
      setErrorMsg(t("auth.resetTokenInvalid"));
      return;
    }

    if (password.length < 8) {
      setErrorMsg(t("auth.weakPasswordMsg"));
      return;
    }

    setLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);

    if (error) {
      setErrorMsg(t("auth.resetTokenInvalid"));
      return;
    }

    setSuccessMsg(t("auth.resetPasswordSuccess"));
    setPassword("");
  }

  if (tokenError === "INVALID_TOKEN") {
    return (
      <section className="auth-card">
        <p role="alert" className="form-error">
          {t("auth.resetTokenInvalid")}
        </p>
        <div className="auth-card-footer">
          <Link href="/forgot-password" className="btn-link">
            {t("auth.sendResetLink")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-card">
      <div className="auth-card-head">
        <h2 className="auth-card-title">{t("auth.resetPasswordTitle")}</h2>
        <p className="auth-card-subtitle">{t("auth.resetPasswordSubtitle")}</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor={passwordId} className="form-label">
            {t("account.newPassword")}
            <span className="form-label-hint">{t("auth.passwordHint")}</span>
          </label>
          <input
            id={passwordId}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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

        <button type="submit" className="btn-primary" disabled={loading || !token || undefined} aria-busy={loading || undefined}>
          {loading ? t("auth.loading") : t("auth.resetPasswordButton")}
        </button>
      </form>

      {successMsg ? (
        <div className="auth-card-footer">
          <Link href="/" className="btn-link">
            {t("auth.backToSignIn")}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
