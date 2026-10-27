import { clerk } from "@clerk/testing/playwright";
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";

// Row-level security, seen from the screen: two people each log an
// application, and each one's list shows only their own. Both are signed
// in at once, in separate browser contexts (separate cookies and storage).
// The two applications are deleted at the end, even if a check fails.
//
// Needs two existing users in the Clerk development instance, whose emails
// are E2E_USER_A_EMAIL and E2E_USER_B_EMAIL in .env.local.

const ROLE = "Data Analyst";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} in .env.local to a test user's email in the Clerk development instance.`);
  return value;
}

// Openly fictional, and unique to this run so an earlier run can't match.
function uniqueCompany(who: string): string {
  return `Example Co ${who} ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A list row's "Open" link, which names the application for screen readers:
// "Open" plus a hidden ": Data Analyst at Example Co …". Chrome reads the
// hidden part as its own box and puts a space before the colon ("Open :
// …"), so that one space may or may not be there. Everything else must
// match exactly, start to end.
function openLink(page: Page, company: string) {
  return page.getByRole("link", {
    name: new RegExp(`^Open\\s?: ${escapeRegExp(ROLE)} at ${escapeRegExp(company)}$`),
  });
}

async function signIn(browser: Browser, email: string): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  // signIn needs a page that loads Clerk and isn't protected: the welcome page.
  await page.goto("/");
  await clerk.signIn({ page, emailAddress: email });
  return { context, page };
}

// Resolves once it's saved: Add goes to the list only after Supabase has
// saved it.
async function logApplication(page: Page, company: string) {
  await page.goto("/add");
  await page.getByLabel("Company", { exact: true }).fill(company);
  await page.getByLabel("Role", { exact: true }).fill(ROLE);
  await page.getByRole("button", { name: "Save application" }).click();
  await expect(page).toHaveURL(/\/applications\?new=/);
}

async function expectOnlyMine(page: Page, mine: string, theirs: string) {
  await page.goto("/applications");
  // Mine first: once it shows, the list has loaded, so "none of theirs" means something.
  await expect(openLink(page, mine)).toBeVisible();
  await expect(openLink(page, theirs)).toHaveCount(0);
}

async function deleteApplication(page: Page, company: string) {
  await page.goto("/applications");
  await openLink(page, company).click();
  await page.getByRole("button", { name: "Delete application" }).click();
  await page.getByRole("button", { name: "Delete it" }).click();
  await expect(page).toHaveURL(/\/applications$/);
  await expect(openLink(page, company)).toHaveCount(0);
}

test("each person sees only their own applications", async ({ browser }) => {
  // Two sign-ins, two saves and the dev server compiling pages on first visit.
  test.setTimeout(120_000);

  const a = { email: required("E2E_USER_A_EMAIL"), company: uniqueCompany("A") };
  const b = { email: required("E2E_USER_B_EMAIL"), company: uniqueCompany("B") };
  const userA = await signIn(browser, a.email);
  const userB = await signIn(browser, b.email);
  // What was saved, so only that is cleaned up. Each one is added as soon
  // as it's saved, before any check that could fail.
  const saved: { page: Page; company: string }[] = [];
  let failure: unknown;

  try {
    await test.step("User A logs an application", async () => {
      await logApplication(userA.page, a.company);
      saved.push({ page: userA.page, company: a.company });
      // The list shows it on top.
      await expect(openLink(userA.page, a.company)).toBeVisible();
    });
    await test.step("User B logs an application", async () => {
      await logApplication(userB.page, b.company);
      saved.push({ page: userB.page, company: b.company });
      await expect(openLink(userB.page, b.company)).toBeVisible();
    });
    await test.step("A's list shows A's, not B's", () => expectOnlyMine(userA.page, a.company, b.company));
    await test.step("B's list shows B's, not A's", () => expectOnlyMine(userB.page, b.company, a.company));
  } catch (error) {
    failure = error;
  }

  // Every saved application is deleted. A failed check above is reported
  // ahead of a failed delete.
  for (const { page, company } of saved) {
    try {
      await test.step(`Delete ${company}`, () => deleteApplication(page, company));
    } catch (error) {
      failure ??= error;
    }
  }
  await userA.context.close();
  await userB.context.close();
  if (failure) throw failure;
});
