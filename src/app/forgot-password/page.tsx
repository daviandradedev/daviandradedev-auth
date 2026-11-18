import { Suspense } from "react";
import { ForgotPasswordPanel } from "@/components/forgot-password-panel";
import { HomeHero } from "@/components/home-hero";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <HomeHero />
      <Suspense fallback={<div className="auth-card auth-card--loading" aria-hidden="true" />}>
        <ForgotPasswordPanel />
      </Suspense>
    </div>
  );
}
