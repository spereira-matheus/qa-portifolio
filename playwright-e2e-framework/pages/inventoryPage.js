export class InventoryPage {
    constructor(page) {
      this.page = page;
      this.inventoryContainer = page.locator('[data-test="inventory-container"]');
      this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    }
  
    addItemByName(name) {
      // SauceDemo: botão "Add to cart" costuma ficar no card do item pelo nome.
      const item = this.page.locator(".inventory_item").filter({ hasText: name });
      return item.locator('button:has-text("Add to cart")');
    }
  
    async expectLoaded() {
      await this.inventoryContainer.waitFor({ state: "visible" });
    }
  
    async goToCart() {
      await this.cartLink.click();
    }
  }
  