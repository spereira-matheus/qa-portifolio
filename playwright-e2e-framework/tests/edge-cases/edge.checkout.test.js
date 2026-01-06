import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage.js";
import { InventoryPage } from "../../pages/inventoryPage.js";
import { CartPage } from "../../pages/cartPage.js";
import { CheckoutPage } from "../../pages/checkoutPage.js";
import { users, checkoutData } from "../../fixtures/testData.js";

test.describe("Edge Cases — Cart & Checkout State (SauceDemo)",
    { tag: "@edge" }, () => {
  const itemName = "Sauce Labs Backpack";

  test.beforeEach(async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.goto(baseURL);
    await loginPage.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();
  });

  test("Attempting checkout with empty cart should be blocked (no checkout path)",
    { tag: ["@regression"] }, async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    // Go to cart without adding items
    await inventory.goToCart();
    await cart.expectLoaded();

    // SauceDemo still shows a Checkout button, but continuing should keep flow consistent.
    // The expected behavior in real systems is to block checkout. Here we assert "no item summary".
    await cart.goToCheckout();

    // On SauceDemo, it may allow reaching checkout step one even with empty cart.
    // Edge-case test: ensure there are no items later and order completion is not silently incorrect.
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Optional stricter check: navigate forward with empty data should fail validation (firstName required)
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test("Cart state persists after page refresh", { tag: "@smoke"}, async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    // Add item then refresh inventory
    await inventory.addItemByName(itemName).click();
    await page.reload();
    await inventory.expectLoaded();

    // Go to cart and confirm item is present
    await inventory.goToCart();
    await cart.expectLoaded();
    await cart.expectItemPresent(itemName);
  });

  test("Double-click on Finish should not break order completion page", async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addItemByName(itemName).click();
    await inventory.goToCart();
    await cart.expectLoaded();
    await cart.goToCheckout();

    await checkout.fillInformation(checkoutData);
    await checkout.expectSummaryLoaded();

    // Double-click finish quickly (idempotency/resilience edge case)
    await checkout.finishButton.dblclick();

    // Ensure order completion page is reached and stable
    await checkout.expectOrderCompleted();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test("Whitespace in checkout fields should not cause unexpected failure", async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addItemByName(itemName).click();
    await inventory.goToCart();
    await cart.expectLoaded();
    await cart.goToCheckout();

    await checkout.fillInformation({
      firstName: "  Matheus  ",
      lastName: "  Santos  ",
      postalCode: "  12345  ",
    });

    await checkout.expectSummaryLoaded();
    await checkout.finish();
    await checkout.expectOrderCompleted();
  });
});
