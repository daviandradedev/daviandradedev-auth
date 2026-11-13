import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { trustedOrigins } from "@/lib/auth-public";
import { externalHandoffUrl } from "@/lib/utils";

export function externalCallbackTarget(callbackURL: string | undefined) {
  const configured = process.env.BETTER_AUTH_URL;
  if (!configured) return null;

  let hubOrigin: string;
  try {
    hubOrigin = new URL(configured).origin;
  } catch {
    return null;
  }

  return externalHandoffUrl(callbackURL, hubOrigin, trustedOrigins)?.toString() ?? null;
}

export async function externalSessionHandoff(callbackURL: string | undefined) {
  const targetUrl = externalCallbackTarget(callbackURL);
  if (!targetUrl) return null;

  const target = new URL(targetUrl);
  try {
    const issued = await auth.api.generateOneTimeToken({
      headers: await headers(),
    });
    if (!issued?.token) return null;
    target.searchParams.set("ott", issued.token);
    return target.toString();
  } catch {
    return null;
  }
}
