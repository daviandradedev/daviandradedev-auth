import { expect, test } from "@playwright/test";
import { markUserEmailVerified } from "../helpers/test-db";

test.describe("smoke", () => {
  test("contact API rejects anonymous requests", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { subject: "Test", message: "Hello", language: "en" },
    });
    expect(response.status()).toBe(401);
  });

  test("sign-up requires email verification before account access", async ({ page }) => {
    test.skip(!process.env.DATABASE_URL, "DATABASE_URL not configured");

    const email = `smoke-${Date.now()}@example.com`;
    const password = "testpassword123";

    await page.goto("/");
    await page.getByRole("button", { name: /create one|criar uma/i }).click();
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: /create account|criar conta/i }).click();

    await expect(page.getByRole("status")).toContainText(/verification|verifica/i);
    expect(page.url()).not.toContain("/account");
  });

  test("verified user reaches account and contact form", async ({ page }) => {
    test.skip(!process.env.DATABASE_URL, "DATABASE_URL not configured");

    const email = `smoke-${Date.now()}@example.com`;
    const password = "testpassword123";

    await page.goto("/");
    await page.getByRole("button", { name: /create one|criar uma/i }).click();
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: /create account|criar conta/i }).click();
    await expect(page.getByRole("status")).toBeVisible();

    await markUserEmailVerified(email);

    await page.getByRole("button", { name: /already have|já tem conta/i }).click();
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: /sign in|entrar/i }).click();

    await page.waitForURL("**/account", { timeout: 15_000 });
    await page.goto("/contact");
    await expect(page.getByRole("button", { name: /send message|enviar mensagem/i })).toBeEnabled();
  });
});
