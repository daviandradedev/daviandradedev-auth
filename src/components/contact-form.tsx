"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  defaultContactMessage,
  defaultContactSubject,
} from "@/lib/contact";
import { useLanguage } from "@/lib/contexts/language-context";

type ContactFormProps = {
  user: {
    name: string;
    email: string;
  } | null;
};

export function ContactForm({ user }: ContactFormProps) {
  const { t, language } = useLanguage();
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const subjectId = `${formId}-subject`;
  const messageId = `${formId}-message`;
  const statusId = `${formId}-status`;

  const [name, setName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setErrorMsg("");
    setSuccessMsg("");

    if (!user) {
      setErrorMsg(t("contact.signInRequired"));
      return;
    }

    const form = new FormData(formEl);
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!subject || !message) {
      setErrorMsg(t("auth.formInvalidMsg"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subject,
          message,
          language,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        if (payload?.error === "UNAUTHORIZED") {
          setErrorMsg(t("contact.signInRequired"));
        } else if (payload?.error === "EMAIL_NOT_CONFIGURED") {
          setErrorMsg(t("contact.sendNotConfigured"));
        } else if (payload?.error === "RATE_LIMITED") {
          setErrorMsg(t("contact.rateLimited"));
        } else {
          setErrorMsg(t("contact.sendFailed"));
        }
        return;
      }

      setErrorMsg("");
      setSuccessMsg(t("contact.sent"));
      formEl.reset();
    } catch {
      setSuccessMsg("");
      setErrorMsg(t("contact.sendFailed"));
    } finally {
      setLoading(false);
    }
  }

  const canSend = Boolean(user);

  const homeHref = user ? "/account" : "/";

  return (
    <div className="contact-panel">
      <header className="contact-panel-header">
        <Link href={homeHref} className="btn-ghost">
          ← {t("contact.backToHome")}
        </Link>
      </header>

      <a
        href={`https://wa.me/5583993165070?text=${encodeURIComponent(defaultContactMessage(language))}`}
        className="portfolio-spotlight account-bento-hero"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t("contact.whatsappTitle")} — ${t("contact.whatsappDesc")}. ${t("a11y.opensInNewTab")}`}
        style={{ minHeight: "auto", padding: "1.25rem 1.5rem", textDecoration: "none" }}
      >
        <div className="portfolio-spotlight-copy">
          <p className="portfolio-spotlight-eyebrow">{t("contact.whatsappEyebrow")}</p>
          <h2 className="portfolio-spotlight-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            {t("contact.whatsappTitle")}
          </h2>
          <p className="portfolio-spotlight-desc">{t("contact.whatsappDesc")}</p>
        </div>
        <span className="portfolio-spotlight-arrow" aria-hidden="true">
          ↗
        </span>
      </a>

      <section className="auth-card contact-card" aria-labelledby={`${formId}-title`}>
      <div className="auth-card-head">
        <h1 id={`${formId}-title`} className="auth-card-title">
          {t("contact.title")}
        </h1>
        <p className="auth-card-subtitle">{t("contact.subtitle")}</p>
        <p className="contact-to">
          {t("contact.toLabel")} <strong>{CONTACT_EMAIL}</strong>
        </p>
      </div>

      {!user ? (
        <p className="form-error" role="status">
          {t("contact.signInRequired")}{" "}
          <Link href="/?callbackURL=/contact" className="btn-link btn-link--inline">
            {t("auth.signInButton")}
          </Link>
        </p>
      ) : null}

      <form className="form-stack" onSubmit={(e) => void handleSubmit(e)} noValidate>
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
            disabled={!canSend || undefined}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor={emailId} className="form-label">
            {t("contact.replyEmail")}
            <span className="form-label-hint">{t("contact.replyEmailHint")}</span>
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            value={user?.email ?? ""}
            readOnly
            disabled={!canSend || undefined}
            className="form-input"
          />
        </div>

        <div key={language} className="form-field form-field--full">
          <label htmlFor={subjectId} className="form-label">
            {t("contact.subject")}
          </label>
          <input
            id={subjectId}
            name="subject"
            type="text"
            defaultValue={defaultContactSubject(language)}
            required
            disabled={!canSend || undefined}
            className="form-input"
          />
        </div>

        <div key={`${language}-message`} className="form-field form-field--full">
          <label htmlFor={messageId} className="form-label">
            {t("contact.message")}
          </label>
          <textarea
            id={messageId}
            name="message"
            defaultValue={defaultContactMessage(language)}
            required
            rows={4}
            disabled={!canSend || undefined}
            className="form-input form-textarea"
          />
        </div>

        {errorMsg ? (
          <p id={statusId} role="alert" className="form-error">
            {errorMsg}
          </p>
        ) : successMsg ? (
          <p id={statusId} role="status" className="form-success">
            {successMsg}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn-primary"
          disabled={!canSend || loading || undefined}
          aria-busy={loading || undefined}
        >
          {loading ? t("auth.loading") : t("contact.send")}
        </button>
      </form>
    </section>
    </div>
  );
}
