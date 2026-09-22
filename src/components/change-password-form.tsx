"use client";

import { FormEvent, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/lib/contexts/language-context";

export function ChangePasswordForm() {
  const { t } = useLanguage();
  const formId = useId();
  const currentId = `${formId}-current`;
  const nextId = `${formId}-next`;
  const errorId = `${formId}-error`;
  const successId = `${formId}-success`;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword.length < 8) {
      setErrorMsg(t("auth.weakPasswordMsg"));
      return;
    }

    setLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setLoading(false);

    if (error) {
      setErrorMsg(t("account.changePasswordFailed"));
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setSuccessMsg(t("account.changePasswordSuccess"));
  }

  return (
    <form className="account-form" onSubmit={handleSubmit} noValidate aria-describedby={errorMsg ? errorId : successMsg ? successId : undefined}>
      <div className="form-field">
        <label htmlFor={currentId} className="form-label">
          {t("account.currentPassword")}
        </label>
        <div className="form-input-wrap">
          <input
            id={currentId}
            type={showCurrent ? "text" : "password"}
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="form-input"
          />
          <button
            type="button"
            className="form-input-toggle"
            onClick={() => setShowCurrent((v) => !v)}
            aria-label={showCurrent ? t("auth.hidePassword") : t("auth.showPassword")}
            aria-pressed={showCurrent}
            aria-controls={currentId}
          >
            {showCurrent ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor={nextId} className="form-label">
          {t("account.newPassword")}
          <span className="form-label-hint">{t("auth.passwordHint")}</span>
        </label>
        <div className="form-input-wrap">
          <input
            id={nextId}
            type={showNext ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="form-input"
          />
          <button
            type="button"
            className="form-input-toggle"
            onClick={() => setShowNext((v) => !v)}
            aria-label={showNext ? t("auth.hidePassword") : t("auth.showPassword")}
            aria-pressed={showNext}
            aria-controls={nextId}
          >
            {showNext ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
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

      <button type="submit" className="btn-primary btn-primary--compact" disabled={loading || undefined} aria-busy={loading || undefined}>
        {loading ? t("auth.loading") : t("account.changePasswordButton")}
      </button>
    </form>
  );
}
