export function safeNextPath(raw: string | null | undefined) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/account";
  }
  const pathname = raw.split(/[?#]/)[0];
  if (pathname === "/continue") return "/account";
  return raw;
}
