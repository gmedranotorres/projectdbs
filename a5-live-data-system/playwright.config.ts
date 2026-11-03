import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

// The Clerk keys and the two test users' emails come from .env.local, the
// same file `next dev` reads. Where there's no such file (CI), they're set
// in the environment instead. Variables already set are kept.
try {
  process.loadEnvFile(path.join(__dirname, ".env.local"));
} catch {
  // No .env.local: use the environment as it is.
}

const PORT = 3000;
// Set E2E_BASE_URL to test a deployed site instead of starting a local one.
const deployed = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  // clerkSetup(): a Clerk testing token, once per run.
  globalSetup: "./tests/global-setup.ts",
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: deployed ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: deployed
    ? undefined
    : {
        command: "npm run dev",
        url: `http://localhost:${PORT}`,
        // A dev server already running is used as it is.
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
