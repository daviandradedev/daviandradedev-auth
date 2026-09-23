import { redirect } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { getCurrentUser } from "@/lib/api/auth";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/?callbackURL=/contact");

  return (
    <div className="auth-page">
      <ContactForm
        user={{
          name: user.name,
          email: user.email,
        }}
      />
    </div>
  );
}
