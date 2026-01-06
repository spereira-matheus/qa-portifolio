import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage.js";
import { InventoryPage } from "../../pages/inventoryPage.js";
import { users } from "../../fixtures/testData.js";

test.describe("Edge Cases — Auth & Session (SauceDemo)",
    { tag: "@edge" }, () => {
  test("Direct access to protected route without login redirects to Login", async ({ page, baseURL }) => {
    // Access inventory directly
    await page.goto(`${baseURL}inventory.html`);

    // SauceDemo redirects to login when not authenticated
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test("After logout, browser Back should not restore authenticated page", async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.goto(baseURL);
    await loginPage.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();
    await expect(page).toHaveURL(/inventory\.html/);

    // Logout
    await page.locator("#react-burger-menu-btn").click();
    await page.locator("#logout_sidebar_link").click();

    // Confirm back at login
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // Try to go back in history
    await page.goBack();

    // Still should not allow access to inventory
    // SauceDemo usually keeps you on login if session is cleared; ensure not inventory.
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test("Session invalidation (clear storage) blocks further access to protected pages", async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.goto(baseURL);
    await loginPage.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    // Invalidate client-side state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();

    // Attempt to navigate to a protected route
    await page.goto(`${baseURL}inventory.html`);

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
