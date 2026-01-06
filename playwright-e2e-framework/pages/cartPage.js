export class CartPage {
    constructor(page) {
      this.page = page;
      this.cartList = page.locator(".cart_list");
      this.checkoutButton = page.locator('[data-test="checkout"]');
      this.cartItems = page.locator(".cart_item");
    }
  
    removeItemByName(name) {
      const item = this.page.locator(".cart_item").filter({ hasText: name });
      return item.locator('button:has-text("Remove")');
    }
  
    async expectLoaded() {
      await this.cartList.waitFor({ state: "visible" });
    }
  
    async goToCheckout() {
      await this.checkoutButton.click();
    }
  
    async expectItemPresent(name) {
      await this.page.locator(".cart_item").filter({ hasText: name }).first().waitFor();
    }
  
    async expectEmpty() {
      // Carrinho vazio geralmente mantém o container, mas sem itens.
      await this.cartItems.first().waitFor({ state: "detached" }).catch(() => {});
      // fallback robusto:
      await this.page.waitForTimeout(200);
      const count = await this.cartItems.count();
      if (count !== 0) throw new Error(`Expected empty cart, but found ${count} items.`);
    }
  }
  