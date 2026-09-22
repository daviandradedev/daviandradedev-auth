import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { HomeHero } from "@/components/home-hero";
import { getCurrentUser } from "@/lib/api/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="auth-page">
      <HomeHero />
      <Suspense fallback={<div className="auth-card auth-card--loading" aria-hidden="true" />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
