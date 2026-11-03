import { clerkSetup } from "@clerk/testing/playwright";

// Fetches a Clerk testing token once per run, so Clerk's bot protection
// lets the test browsers sign in. It reads NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
// and CLERK_SECRET_KEY (loaded in playwright.config.ts), and only works
// with a development instance's keys.
export default async function globalSetup() {
  await clerkSetup();
}
