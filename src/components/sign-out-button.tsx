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
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/5"
    >
      {t("auth.signOut")}
    </button>
  );
}
