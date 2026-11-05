import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getCurrentSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
    query: { disableRefresh: true },
  }),
);

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}
