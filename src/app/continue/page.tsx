import { ContinueRedirect } from "@/components/redirect-screen";
import { safeNextPath } from "@/lib/bootstrap-next";

export const dynamic = "force-dynamic";

export default async function ContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <ContinueRedirect nextPath={safeNextPath(next)} />;
}
