import { clerk } from "@clerk/testing/playwright";
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";

// The live page, seen from the screen, with the real database and the real
// worker running. Two people sign in at once, in separate browser contexts.
//
// Needs two existing users in the Clerk development instance, whose emails are
// E2E_USER_A_EMAIL and E2E_USER_B_EMAIL in .env.local. Anything they follow here
// is unfollowed at the end, even if a check fails.

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} in .env.local to a test user's email in the Clerk development instance.`);
  return value;
}

async function signIn(browser: Browser, email: string): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/");
  await clerk.signIn({ page, emailAddress: email });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Your stations" })).toBeVisible();
  return { context, page };
}

async function follow(page: Page, station: string) {
  await page.getByLabel("Find a station").fill(station);
  await page.getByRole("button", { name: new RegExp(`^Follow\\s+${station}$`) }).click();
  await expect(page.getByTestId("station").filter({ hasText: station })).toBeVisible();
}

async function unfollowEverything(page: Page) {
  const buttons = page.getByRole("button", { name: /^Unfollow/ });
  while ((await buttons.count()) > 0) {
    const before = await buttons.count();
    await buttons.first().click();
    await expect(buttons).toHaveCount(before - 1);
  }
}

test("each person sees only the stations they chose", async ({ browser }) => {
  const a = await signIn(browser, required("E2E_USER_A_EMAIL"));
  const b = await signIn(browser, required("E2E_USER_B_EMAIL"));
  try {
    await unfollowEverything(a.page);
    await unfollowEverything(b.page);

    await follow(a.page, "Ellis Ave & 58th St");
    await follow(b.page, "Blackstone Ave & 59th St");

    await a.page.reload();
    await b.page.reload();
    await expect(a.page.getByTestId("station").filter({ hasText: "Ellis Ave & 58th St" })).toBeVisible();
    await expect(a.page.getByTestId("station")).toHaveCount(1);
    await expect(b.page.getByTestId("station").filter({ hasText: "Blackstone Ave & 59th St" })).toBeVisible();
    await expect(b.page.getByTestId("station")).toHaveCount(1);
  } finally {
    await unfollowEverything(a.page);
    await unfollowEverything(b.page);
    await a.context.close();
    await b.context.close();
  }
});

test("the page shows Live and keeps checking without a refresh", async ({ browser }) => {
  test.setTimeout(90_000);
  const a = await signIn(browser, required("E2E_USER_A_EMAIL"));
  try {
    const status = a.page.getByTestId("status");
    await expect(status).toHaveAttribute("data-state", "fresh", { timeout: 20_000 });

    // Nothing reloads in this test: a new age can only come from a Realtime
    // event about a new run. It must be low again after the first one has grown.
    const seenAges: number[] = [];
    await expect
      .poll(
        async () => {
          const text = (await status.textContent()) ?? "";
          const match = text.match(/Checked (just now|(\d+) seconds ago)/);
          const age = !match ? -1 : match[1] === "just now" ? 0 : Number(match[2]);
          seenAges.push(age);
          const rose = seenAges.findIndex((value, i) => i > 0 && value > seenAges[i - 1]);
          return rose >= 0 && seenAges.slice(rose).some((value, i, all) => i > 0 && value < all[i - 1]);
        },
        { timeout: 45_000, intervals: [1000] },
      )
      .toBe(true);
    await expect(status).toHaveAttribute("data-state", "fresh");
    // The words that only appear when Realtime has refused or dropped the page.
    await expect(status).not.toContainText("live connection dropped");
  } finally {
    await a.context.close();
  }
});
