import { defineConfig, devices } from "@playwright/test";
import { getEnvironmentConfig } from "./config/environments";

process.env["ENVIRONMENT"] ||= process.env["PW_TEST_ENVIRONMENT"] || "prod";

const env = getEnvironmentConfig();

export default defineConfig({
  globalSetup: require.resolve("./lib/global/globalSetup"),
  testDir: "./tests",
  testMatch: ["**/Test_**.ts"],
  testIgnore: ["**/old files/**"],

  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 1 : 0,
  workers: process.env["CI"] ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { outputFolder: "public", open: "never" }],
    ["junit", { outputFile: "results.xml" }],
  ],

  use: {
    baseURL: env.baseUrl,
    browserName: "chromium",
    ignoreHTTPSErrors: true,
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: "retain-on-failure",
    video: "on",
    screenshot: "only-on-failure",
  },

  projects: [
    // Setup project — runs login once per user before tests use stored state
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user1.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user1.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/user1.json",
      },
      dependencies: ["setup"],
    },
  ],
});
