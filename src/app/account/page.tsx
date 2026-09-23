import { redirect } from "next/navigation";
import { AccountView } from "@/components/account-view";
import { getCurrentUser } from "@/lib/api/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <AccountView
      user={{
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: Boolean(user.emailVerified),
        receivesNewsletter: Boolean(user.receivesNewsletter),
      }}
    />
  );
}
