import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage.js";
import { InventoryPage } from "../../pages/inventoryPage.js";
import { CartPage } from "../../pages/cartPage.js";
import { CheckoutPage } from "../../pages/checkoutPage.js";
import { users, checkoutData } from "../../fixtures/testData.js";

test.describe("Checkout flow", { tag: "@regression" }, () => {
  const itemName = "Sauce Labs Backpack";

  test.beforeEach(async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.goto(baseURL);
    await loginPage.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();
  });

  test("Complete checkout (E2E critical flow)", 
    { tag: "@smoke" }, async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addItemByName(itemName).click();
    await inventory.goToCart();

    await cart.expectLoaded();
    await cart.expectItemPresent(itemName);

    await cart.goToCheckout();
    await checkout.fillInformation(checkoutData);

    await checkout.expectSummaryLoaded();
    await checkout.finish();

    await checkout.expectOrderCompleted();
    await expect(page).toHaveURL(/checkout-complete/);
  });

  test("Remove item from cart results in empty cart", async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.addItemByName(itemName).click();
    await inventory.goToCart();

    await cart.expectLoaded();
    await cart.expectItemPresent(itemName);

    await cart.removeItemByName(itemName).click();
    await cart.expectEmpty();
  });
});
