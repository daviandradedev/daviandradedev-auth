import { Suspense } from "react";
import { HomeHero } from "@/components/home-hero";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="auth-page">
      <HomeHero />
      <Suspense fallback={<div className="auth-card auth-card--loading" aria-hidden="true" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
