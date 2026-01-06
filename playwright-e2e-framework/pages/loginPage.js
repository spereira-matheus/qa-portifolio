import { expect } from "@playwright/test";

export class LoginPage {
    constructor(page) {
      this.page = page;
      this.usernameInput = page.locator('[data-test="username"]');
      this.passwordInput = page.locator('[data-test="password"]');
      this.loginButton = page.locator('[data-test="login-button"]');
      this.errorMessage = page.locator('[data-test="error"]');
    }
  
    async goto(baseURL) {
      await this.page.goto(baseURL);
    }
  
    async login(username, password) {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
  
    async expectErrorContains(text) {
      await this.errorMessage.waitFor({ state: "visible" });
      await expect(this.errorMessage).toContainText(text);
    }
  }
  