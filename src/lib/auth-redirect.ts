export async function redirectToExternalApp(callbackURL: string) {
  try {
    const hub = process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? window.location.origin;
    const response = await fetch(`${hub}/api/auth/one-time-token/generate`, {
      credentials: "include",
    });
    const token = response.ok ? ((await response.json()) as { token?: string }).token : undefined;
    if (token) {
      const target = new URL(callbackURL);
      target.searchParams.set("ott", token);
      window.location.href = target.toString();
      return true;
    }
  } catch {
  }

  window.location.href = callbackURL;
  return false;
}
