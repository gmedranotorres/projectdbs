import { ButtonLink, Tag, TextLink } from "./ui";

// What someone sees before they've saved anything: what the ritual is, a
// picture of where it leads, and one thing to do.
export function FirstVisit() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          Know who to follow up with, every Monday
        </h1>
        <p className="text-lg text-muted">
          Log each application as you send it. Seguimiento picks a follow-up date, and on
          Monday it tells you who to follow up with.
        </p>
      </div>

      <ButtonLink href="/add" className="w-full sm:w-auto">
        Log your first application
      </ButtonLink>

      <figure className="rounded-xl border border-dashed border-line-strong bg-surface p-4">
        <figcaption className="mb-3 text-sm font-medium text-muted">
          Example: what a Monday looks like
        </figcaption>
        <p className="font-semibold">Follow up this week</p>
        <ul className="mt-2 divide-y divide-line">
          <li className="flex flex-wrap items-center justify-between gap-2 py-3">
            <span>
              <span className="font-medium">Email Priya at Morningstar</span>
              <span className="block text-sm text-muted">Data Analyst · Applied</span>
            </span>
            <Tag tone="late">2 days late</Tag>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-2 py-3">
            <span>
              <span className="font-medium">Grubhub</span>
              <span className="block text-sm text-muted">Product Analyst · Followed up</span>
            </span>
            <Tag>Due Thu, Oct 22</Tag>
          </li>
        </ul>
      </figure>

      <p className="text-muted">
        Already using Seguimiento on another device?{" "}
        <TextLink href="/move">Load a backup</TextLink>.
      </p>
    </div>
  );
}
