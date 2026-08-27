import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/api/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
          SSO
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
          daviandrade.dev
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          One account. Every portfolio app.
        </p>
      </div>
      <Suspense fallback={<div className="h-80 w-full max-w-sm animate-pulse rounded-3xl bg-zinc-900" />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
