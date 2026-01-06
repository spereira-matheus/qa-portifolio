import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage.js";
import { InventoryPage } from "../../pages/inventoryPage.js";
import { users } from "../../fixtures/testData.js";

test.describe("Authentication", { tag: "@regression" }, () => {
  test("Login succeeds with valid credentials", { tag: "@smoke" }, async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.goto(baseURL);
    await loginPage.login(users.standard.username, users.standard.password);

    await inventory.expectLoaded();
    await expect(page).toHaveURL(/inventory/);
  });

  test("Login fails with invalid credentials", { tag: "@smoke" }, async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto(baseURL);
    await loginPage.login(users.invalid.username, users.invalid.password);

    await loginPage.expectErrorContains("Username and password do not match");
  });

  test("Locked out user cannot login", async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto(baseURL);
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await loginPage.expectErrorContains("locked out");
  });
});
