"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/lib/contexts/language-context";

export function SignOutButton() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {t("auth.signOut")}
    </button>
  );
}
