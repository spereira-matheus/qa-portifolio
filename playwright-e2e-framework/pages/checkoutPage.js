import { expect } from "@playwright/test";

export class CheckoutPage {
    constructor(page) {
      this.page = page;
      this.firstName = page.locator('[data-test="firstName"]');
      this.lastName = page.locator('[data-test="lastName"]');
      this.postalCode = page.locator('[data-test="postalCode"]');
  
      this.continueButton = page.locator('[data-test="continue"]');
      this.finishButton = page.locator('[data-test="finish"]');
  
      this.summaryContainer = page.locator('[data-test="checkout-summary-container"]');
      this.completeHeader = page.locator('[data-test="complete-header"]');
    }
  
    async fillInformation({ firstName, lastName, postalCode }) {
      await this.firstName.fill(firstName);
      await this.lastName.fill(lastName);
      await this.postalCode.fill(postalCode);
      await this.continueButton.click();
    }
  
    async expectSummaryLoaded() {
      await this.summaryContainer.waitFor({ state: "visible" });
    }
  
    async finish() {
      await this.finishButton.click();
    }
  
    async expectOrderCompleted() {
      await this.completeHeader.waitFor({ state: "visible" });
      await expect(this.completeHeader).toContainText("Thank you for your order");
    }
  }
  