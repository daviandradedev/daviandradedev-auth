import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { HomeHero } from "@/components/home-hero";
import { ExternalRedirect } from "@/components/redirect-screen";
import { getCurrentUser } from "@/lib/api/auth";
import { externalCallbackTarget } from "@/lib/external-handoff";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string }>;
}) {
  const user = await getCurrentUser();
  const { callbackURL } = await searchParams;
  if (user) {
    const target = externalCallbackTarget(callbackURL);
    if (target) return <ExternalRedirect callbackURL={target} />;
    redirect("/account");
  }

  return (
    <div className="auth-page">
      <HomeHero />
      <Suspense fallback={<div className="auth-card auth-card--loading" aria-hidden="true" />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
