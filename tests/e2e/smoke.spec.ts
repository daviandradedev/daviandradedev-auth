import { expect, test, type Page } from "@playwright/test";

async function createAccount(page: Page) {
  const email = `smoke-${Date.now()}@example.com`;
  const password = "testpassword123";

  await page.goto("/");
  await page.getByRole("button", { name: /create one|criar uma/i }).click();
  await page.getByRole("textbox", { name: /^name$|^nome$/i }).fill("Smoke User");
  await page.getByRole("textbox", { name: /email|e-mail/i }).fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: /create account|criar conta/i }).click();
  await expect(page.getByText(/verification|verifica/i)).toBeVisible();
  await page.waitForURL("**/account", { timeout: 15_000 });

  return email;
}

test.describe("smoke", () => {
  test("contact API rejects anonymous requests", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { subject: "Test", message: "Hello", language: "en" },
    });
    expect(response.status()).toBe(401);
  });

  test("sign-up opens the account without an email confirmation", async ({ page }) => {
    test.skip(!process.env.DATABASE_URL, "DATABASE_URL not configured");

    await createAccount(page);
    await expect(page).toHaveURL(/\/account/);
  });

  test("signed-up user reaches the contact form", async ({ page }) => {
    test.skip(!process.env.DATABASE_URL, "DATABASE_URL not configured");

    await createAccount(page);
    await page.goto("/contact");
    await expect(page.getByRole("button", { name: /send message|enviar mensagem/i })).toBeEnabled();
  });
});
