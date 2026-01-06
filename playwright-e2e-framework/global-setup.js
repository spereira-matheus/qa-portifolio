import { chromium } from "@playwright/test";
import { users } from "./utils/testData.js";

export default async function globalSetup(config) {
  const baseURL = config.projects[0].use.baseURL;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL);
  await page.locator('[data-test="username"]').fill(users.standard.username);
  await page.locator('[data-test="password"]').fill(users.standard.password);
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL(/inventory\.html/);

  await page.context().storageState({ path: "storage/adminState.json" });

  await browser.close();
}