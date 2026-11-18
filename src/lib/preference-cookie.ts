export function preferenceCookieDomain() {
  if (typeof window === "undefined" || !window.location.hostname.includes("daviandrade.dev")) return "";
  return "domain=.daviandrade.dev;";
}
