import { CalendarReminder } from "./calendar-reminder";
import { Badge, ButtonLink, PageHeader, TextLink } from "./ui";

// What someone sees before they've saved anything: what the ritual is, a
// picture of where it leads, and one thing to do.
export function FirstVisit() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Know who to follow up with, every Monday"
        description={
          <p className="text-lg">
            Log each application as you send it. Seguimiento picks a follow-up date, and on
            Monday it tells you who to follow up with.
          </p>
        }
      />

      <div className="space-y-3">
        <ButtonLink href="/add" className="w-full sm:w-auto">
          Log your first application
        </ButtonLink>
        <p className="text-muted">
          Already applied somewhere? Log those too, with the day you applied. Anything from a
          week ago or more shows up right away in This week, ready to follow up.
        </p>
      </div>

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
            <Badge tone="due">2 days late</Badge>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-2 py-3">
            <span>
              <span className="font-medium">Grubhub</span>
              <span className="block text-sm text-muted">Product Analyst · Followed up</span>
            </span>
            <Badge>Due Thu, Oct 22</Badge>
          </li>
        </ul>
        <p className="mt-3 border-t border-line pt-3 text-sm text-muted">
          Seguimiento suggests a follow-up a week after you apply, and you can always change it.
          After 3 weeks with no news, an application is marked gone quiet.
        </p>
      </figure>

      <CalendarReminder />

      <p className="text-muted">
        Already using Seguimiento on another device?{" "}
        <TextLink href="/move">Load a backup</TextLink>.
      </p>
    </div>
  );
}
