import { ContactForm } from "@/components/contact-form";
import { getCurrentUser } from "@/lib/api/auth";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <div className="auth-page">
      <ContactForm
        user={
          user
            ? {
                name: user.name,
                email: user.email,
              }
            : null
        }
      />
    </div>
  );
}
