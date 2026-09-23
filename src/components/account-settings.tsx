"use client";

import { ChangePasswordForm } from "@/components/change-password-form";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { SignOutButton } from "@/components/sign-out-button";
import { useLanguage } from "@/lib/contexts/language-context";

type AccountSettingsProps = {
  user: {
    email: string;
    name: string;
    image?: string | null;
    emailVerified?: boolean;
    receivesNewsletter?: boolean | null;
  };
  onBack: () => void;
};

export function AccountSettings({ user, onBack }: AccountSettingsProps) {
  const { t } = useLanguage();

  return (
    <div className="account-settings">
      <header className="account-settings-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          ← {t("account.backToAccount")}
        </button>
        <h1 className="account-title">{t("account.settingsTitle")}</h1>
        <p className="account-email">{user.email}</p>
      </header>

      <div className="account-settings-stack">
        <section aria-labelledby="profile-heading" className="settings-panel">
          <h2 id="profile-heading" className="account-section-title">
            {t("account.profile")}
          </h2>
          <p className="account-security-hint">{t("account.profileHint")}</p>
          <ProfileSettingsForm user={user} />
        </section>

        <section aria-labelledby="security-heading" className="settings-panel">
          <h2 id="security-heading" className="account-section-title">
            {t("account.security")}
          </h2>
          <p className="account-security-hint">{t("account.securityHint")}</p>
          <ChangePasswordForm />
        </section>

        <section aria-labelledby="session-heading" className="settings-panel">
          <h2 id="session-heading" className="account-section-title">
            {t("account.session")}
          </h2>
          <p className="account-security-hint">{t("account.sessionHint")}</p>
          <SignOutButton />
        </section>
      </div>
    </div>
  );
}
