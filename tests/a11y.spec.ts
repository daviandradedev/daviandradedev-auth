import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] as const;

type AxeViolation = {
  id: string;
  impact?: string;
  description: string;
  nodes: Array<{ html: string; failureSummary?: string }>;
};

async function expectNoAxeViolations(pageUrl: string, page: Page) {
  await page.goto(pageUrl, { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).withTags([...wcagTags]).analyze();
  expect(results.violations, formatViolations(results.violations as AxeViolation[])).toEqual([]);
}

function formatViolations(violations: AxeViolation[]) {
  if (violations.length === 0) return "";
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description}\n${v.nodes
          .map((n) => `  - ${n.html}\n    ${n.failureSummary ?? ""}`)
          .join("\n")}`,
    )
    .join("\n\n");
}

test.describe("accessibility", () => {
  test("home page — light theme", async ({ page }) => {
    await expectNoAxeViolations("/", page);
  });

  test("home page — dark theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark");
      document.cookie = "theme=dark;path=/;max-age=31536000;SameSite=Lax";
      document.documentElement.classList.add("dark");
    });
    await expectNoAxeViolations("/", page);
  });

  test("home page — high contrast preference", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await expectNoAxeViolations("/", page);
  });

  test("home page — reduced motion preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectNoAxeViolations("/", page);
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to main content|ir para o conteúdo principal/i });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("auth form exposes accessible names", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /email|e-mail/i })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|entrar/i })).toBeVisible();
  });

  test("form error is announced", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /sign in|entrar/i }).click();
    const alert = page.locator("#main-content [role='alert']");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/check the highlighted|verifique os campos/i);
  });

  test("loading submit button meets contrast requirements", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /sign in|entrar/i }).evaluate((button) => {
      (button as HTMLButtonElement).disabled = true;
    });

    const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const contrastViolations = results.violations.filter((violation) => violation.id === "color-contrast");
    expect(contrastViolations, formatViolations(contrastViolations as AxeViolation[])).toEqual([]);
  });

  test("forgot password page", async ({ page }) => {
    await expectNoAxeViolations("/forgot-password", page);
  });

  test("reset password page — invalid token state", async ({ page }) => {
    await expectNoAxeViolations("/reset-password?error=INVALID_TOKEN", page);
  });

  test("account page — authenticated", async ({ page }) => {
    test.skip(!process.env.DATABASE_URL, "DATABASE_URL not configured");

    const { markUserEmailVerified } = await import("./helpers/test-db");
    const email = `a11y-${Date.now()}@example.com`;
    const password = "testpassword123";

    await page.goto("/");
    await page.getByRole("button", { name: /create one|criar uma/i }).click();
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: /create account|criar conta/i }).click();
    await markUserEmailVerified(email);

    await page.getByRole("button", { name: /already have|já tem conta/i }).click();
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: /sign in|entrar/i }).click();

    await page.waitForURL("**/account", { timeout: 15_000 });

    await expectNoAxeViolations("/account", page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /work schedule/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /portfolio|portfólio/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /settings|configurações/i })).toBeVisible();

    await page.getByRole("button", { name: /settings|configurações/i }).click();
    await expect(page.getByRole("heading", { name: /account settings|configurações da conta/i })).toBeVisible();
    const settingsResults = await new AxeBuilder({ page }).withTags([...wcagTags]).analyze();
    expect(settingsResults.violations, formatViolations(settingsResults.violations as AxeViolation[])).toEqual([]);
  });

  test("contact page", async ({ page }) => {
    await expectNoAxeViolations("/contact", page);
    await expect(page.getByRole("textbox", { name: /subject|assunto/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /send message|enviar mensagem/i })).toBeVisible();
  });
});
