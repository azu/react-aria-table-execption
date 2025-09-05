import { defineConfig, devices } from "@playwright/test";

const isProduction = process.env.NODE_ENV === "production";
const port = isProduction ? 4173 : 5173;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: "list",

  outputDir: "playwright-results",

  use: {
    baseURL: `http://localhost:${port}`,
    screenshot: "on",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    navigationTimeout: process.env.CI ? 60 * 1000 : 15 * 1000,
    actionTimeout: process.env.CI ? 30 * 1000 : 15 * 1000,
  },

  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1800, height: 1200 },
      },
    },
  ],

  webServer: {
    command: isProduction ? "pnpm preview" : "pnpm dev",
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
