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

export default defineConfig({
  testDir: "./tests",
  // clerkSetup(): a Clerk testing token, once per run.
  globalSetup: "./tests/global-setup.ts",
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: `http://localhost:${PORT}`,
    // A dev server already running is used as it is.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
