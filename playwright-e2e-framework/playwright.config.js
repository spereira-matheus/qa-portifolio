import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.test.js",
  globalSetup: "./global-setup.js",
  retries: 1,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "https://www.saucedemo.com/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});