import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth";
import { portfolioApps } from "@/lib/apps";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Account</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Signed in as <span className="text-zinc-200">{user.email}</span>
          </p>
          <p className="mt-1 text-sm text-zinc-500">{user.name}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Connected apps
        </h2>
        <ul className="space-y-2">
          {portfolioApps.map((app) => (
            <li key={app.id}>
              <Link
                href={app.href}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.06]"
              >
                <div>
                  <p className="font-semibold text-white">{app.id}</p>
                  <p className="text-xs text-zinc-500">{app.description.en}</p>
                </div>
                <span className="text-xs text-emerald-400">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
