"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fileToAvatarDataUrl, initialsFromName } from "@/lib/avatar";
import { normalizeAuthEmail } from "@/lib/auth-policy";
import { useLanguage } from "@/lib/contexts/language-context";

type ProfileSettingsFormProps = {
  user: {
    email: string;
    name: string;
    image?: string | null;
    emailVerified?: boolean;
    receivesNewsletter?: boolean | null;
  };
};

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const imageId = `${formId}-image`;
  const errorId = `${formId}-error`;
  const successId = `${formId}-success`;
  const fileRef = useRef<HTMLInputElement>(null);

  const emailVerified = Boolean(user.emailVerified);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState<string | null>(user.image ?? null);
  const [receivesNewsletter, setReceivesNewsletter] = useState(Boolean(user.receivesNewsletter));
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleImagePick(file: File | undefined) {
    if (!file) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setImage(dataUrl);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "IMAGE_FILE_TOO_LARGE" || code === "IMAGE_TOO_LARGE") {
        setErrorMsg(t("account.avatarTooLarge"));
      } else {
        setErrorMsg(t("account.avatarInvalid"));
      }
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSendVerification() {
    setErrorMsg("");
    setSuccessMsg("");
    setVerifyLoading(true);
    const { error } = await authClient.sendVerificationEmail({
      email: user.email,
      callbackURL: "/account",
    });
    setVerifyLoading(false);
    if (error) {
      setErrorMsg(t("account.verifyEmailFailed"));
      return;
    }
    setSuccessMsg(t("account.verifyEmailSent"));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const nextName = name.trim();
    const nextEmail = normalizeAuthEmail(email);
    if (!nextName || !nextEmail || !nextEmail.includes("@")) {
      setErrorMsg(t("auth.formInvalidMsg"));
      return;
    }

    const emailChanged = nextEmail !== normalizeAuthEmail(user.email);
    if (emailChanged && !emailVerified) {
      setErrorMsg(t("account.emailChangeRequiresVerification"));
      return;
    }

    setLoading(true);

    const profileChanged = nextName !== user.name || image !== (user.image ?? null) || receivesNewsletter !== Boolean(user.receivesNewsletter);

    if (profileChanged) {
      const { error } = await authClient.updateUser({
        name: nextName,
        image,
        receivesNewsletter,
      });
      if (error) {
        setLoading(false);
        setErrorMsg(t("account.profileUpdateFailed"));
        return;
      }
    }

    if (emailChanged) {
      const { error } = await authClient.changeEmail({
        newEmail: nextEmail,
        callbackURL: "/account",
      });
      if (error) {
        setLoading(false);
        setErrorMsg(t("account.emailUpdateFailed"));
        return;
      }
      setLoading(false);
      setSuccessMsg(t("account.emailChangePending"));
      router.refresh();
      return;
    }

    setLoading(false);
    if (profileChanged) {
      setSuccessMsg(t("account.profileUpdateSuccess"));
      router.refresh();
      return;
    }

    setSuccessMsg(t("account.profileUpdateSuccess"));
  }

  return (
    <form className="account-form" onSubmit={handleSubmit} noValidate>
      <div className="profile-avatar-row">
        <div className="profile-avatar" aria-hidden={image ? undefined : true}>
          {image ? (
            <img src={image} alt="" className="profile-avatar-img" />
          ) : (
            <span className="profile-avatar-fallback">{initialsFromName(name || user.name)}</span>
          )}
        </div>
        <div className="profile-avatar-actions">
          <input
            ref={fileRef}
            id={imageId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => void handleImagePick(e.target.files?.[0])}
          />
          <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
            {t("account.changeAvatar")}
          </button>
          {image ? (
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setImage(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              {t("account.removeAvatar")}
            </button>
          ) : null}
          <p className="account-security-hint">{t("account.avatarHint")}</p>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={nameId} className="form-label">
          {t("account.fullName")}
        </label>
        <input
          id={nameId}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor={emailId} className="form-label">
          {t("auth.emailPlaceholder")}
          <span className="form-label-hint">
            {emailVerified ? t("account.emailVerifiedHint") : t("account.emailUnverifiedHint")}
          </span>
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!emailVerified}
          aria-disabled={!emailVerified || undefined}
          className="form-input"
        />
        {!emailVerified ? (
          <p className="form-field-action">
            <button
              type="button"
              className="btn-link btn-link--inline"
              onClick={() => void handleSendVerification()}
              disabled={verifyLoading || undefined}
              aria-busy={verifyLoading || undefined}
            >
              {verifyLoading ? t("auth.loading") : t("account.sendVerificationEmail")}
            </button>
          </p>
        ) : null}
      </div>

      <div className="form-field form-field--check">
        <input
          type="checkbox"
          id="profileNewsletterOptIn"
          className="form-check-input"
          checked={receivesNewsletter}
          onChange={(e) => setReceivesNewsletter(e.target.checked)}
        />
        <label htmlFor="profileNewsletterOptIn" className="form-check-label">
          {t("auth.newsletterOptIn")}
        </label>
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
        {loading ? t("auth.loading") : t("account.saveProfile")}
      </button>
    </form>
  );
}
