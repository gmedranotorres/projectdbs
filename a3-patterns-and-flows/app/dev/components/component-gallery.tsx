"use client";

import { useState, type ReactNode } from "react";
import { OPEN_STATUSES, STATUS_LABELS, emptyForm, toApplication } from "@/lib/applications";
import { today } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import {
  Badge,
  Button,
  Card,
  Chip,
  ChipGroup,
  EmptyState,
  Field,
  Input,
  List,
  ListRow,
  PageHeader,
  Select,
  Textarea,
  useToast,
  type BadgeTone,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui";

// Every shared component in every state, side by side. Hover, focus
// and active are forced with data-state, so they show without a pointer;
// the components also respond for real.

const STATES = [
  { label: "Rest" },
  { label: "Hover", state: "hover" },
  { label: "Focus", state: "focus" },
  { label: "Active", state: "active" },
  { label: "Disabled", disabled: true },
];

const BUTTONS: { variant: ButtonVariant; text: string }[] = [
  { variant: "primary", text: "Save application" },
  { variant: "secondary", text: "Check the file" },
  { variant: "quiet", text: "Not now" },
  { variant: "danger", text: "Delete" },
];

const SIZES: ButtonSize[] = ["md", "sm"];

const ROLES = ["Data Analyst", "Product Analyst", "UX Researcher"];

const STATUS_BADGES: BadgeTone[] = ["applied", "interviewing", "offer", "closed"];

const TAGS: { tone: BadgeTone; text?: string; note: string }[] = [
  { tone: "due", note: "Due" },
  { tone: "due", text: "2 days late", note: "Due, late" },
  { tone: "quiet", note: "Quiet" },
  { tone: "quiet", text: "No news for 22 days", note: "Quiet, with how long" },
  { tone: "neutral", text: "Follow up Thu, Oct 29", note: "Plain" },
  { tone: "new", text: "Just changed", note: "New" },
];

export function ComponentGallery() {
  return (
    <div className="space-y-12">
      {/* This header is also the PageHeader example. */}
      <PageHeader
        title="Components"
        description="Every shared component in every state. This page isn't in the navigation."
        back={{ href: "/", label: "This week" }}
      />

      <Section title="Button">
        {BUTTONS.map(({ variant, text }) =>
          SIZES.map((size) => (
            <div key={`${variant}-${size}`}>
              <h3 className="font-medium">
                {variant}, {size}
              </h3>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-5">
                {STATES.map(({ label, state, disabled }) => (
                  <Example key={label} label={label}>
                    <Button variant={variant} size={size} data-state={state} disabled={disabled}>
                      {text}
                    </Button>
                  </Example>
                ))}
              </div>
            </div>
          )),
        )}
      </Section>

      <Section title="Field: Input">
        <Example label="Rest, with a hint">
          <Field label="Company" hint="The name on the job posting.">
            <Input />
          </Field>
        </Example>
        <Example label="Filled in">
          <Field label="Company">
            <Input defaultValue="Example Co" />
          </Field>
        </Example>
        <Example label="Optional">
          <Field label="Who to follow up with" optional>
            <Input />
          </Field>
        </Example>
        <Example label="Hover">
          <Field label="Company">
            <Input data-state="hover" defaultValue="Example Co" />
          </Field>
        </Example>
        <Example label="Focus">
          <Field label="Company">
            <Input data-state="focus" defaultValue="Example Co" />
          </Field>
        </Example>
        <Example label="Error">
          <Field label="Company" error="Enter the company name.">
            <Input />
          </Field>
        </Example>
        <Example label="Disabled">
          <Field label="Company">
            <Input defaultValue="Example Co" disabled />
          </Field>
        </Example>
        <Example label="URL, with a placeholder">
          <Field label="Job posting link" optional>
            <Input type="url" inputMode="url" placeholder="https://" />
          </Field>
        </Example>
        <Example label="URL, error">
          <Field label="Job posting link" optional error="Enter a full link, starting with https://.">
            <Input type="url" inputMode="url" defaultValue="example.com/jobs" />
          </Field>
        </Example>
        <Example label="Date">
          <Field label="Date applied">
            <Input type="date" defaultValue="2026-10-05" />
          </Field>
        </Example>
        <Example label="Date, error">
          <Field label="Follow up on" hint="It shows up under This week in the week it's due." error="Choose a day on or after the day you applied.">
            <Input type="date" defaultValue="2026-10-01" />
          </Field>
        </Example>
        <Example label="Date, disabled">
          <Field label="Date applied">
            <Input type="date" defaultValue="2026-10-05" disabled />
          </Field>
        </Example>
      </Section>

      <Section title="Field: Select">
        {[
          { label: "Rest" },
          { label: "Hover", state: "hover" },
          { label: "Focus", state: "focus" },
          { label: "Error", error: "Choose a status." },
          { label: "Disabled", disabled: true },
        ].map(({ label, state, error, disabled }) => (
          <Example key={label} label={label}>
            <Field label="Status" error={error}>
              <Select data-state={state} disabled={disabled} defaultValue="applied">
                {OPEN_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>
          </Example>
        ))}
      </Section>

      <Section title="Field: Textarea">
        {[
          { label: "Rest" },
          { label: "Hover", state: "hover" },
          { label: "Focus", state: "focus" },
          { label: "Error", error: "Keep notes under 2,000 characters." },
          { label: "Disabled", disabled: true },
        ].map(({ label, state, error, disabled }) => (
          <Example key={label} label={label}>
            <Field label="Notes" optional error={error}>
              <Textarea
                data-state={state}
                disabled={disabled}
                defaultValue="Referred by a classmate. Ask about the team's timeline."
              />
            </Field>
          </Example>
        ))}
      </Section>

      <Section title="Chip">
        {[false, true].map((pressed) => (
          <div key={String(pressed)}>
            <h3 className="font-medium">{pressed ? "On" : "Off"}</h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-5">
              {STATES.map(({ label, state, disabled }) => (
                <Example key={label} label={label}>
                  <Chip pressed={pressed} data-state={state} disabled={disabled}>
                    Data Analyst
                  </Chip>
                </Example>
              ))}
            </div>
          </div>
        ))}
        <Example label="Try it">
          <RoleChips />
        </Example>
      </Section>

      <Section title="Card">
        <Card className="space-y-2">
          <p className="font-medium">Example Co</p>
          <p className="text-muted">The surface color, a thin edge, 16px corners and no shadow.</p>
        </Card>
      </Section>

      <Section title="ListRow">
        <List>
          <ListRow company="Example Co" role="Data Analyst" status="applied" followUpOn="2026-10-27" href="/dev/components" />
          <ListRow company="Sample Studio" role="Product Analyst" status="followed-up" followUpOn="2026-11-03" href="/dev/components" />
          <ListRow company="Placeholder Labs" role="UX Researcher" status="interviewing" followUpOn="2026-10-23" href="/dev/components" />
          <ListRow company="Demo Group" role="Data Analyst" status="offer" href="/dev/components" />
          <ListRow company="Fictional Inc" role="Research Assistant" status="rejected" href="/dev/components" />
        </List>
        <Example label="With the one-time tip beside the follow-up date">
          <List>
            <ListRow
              company="Example Co"
              role="Data Analyst"
              status="applied"
              followUpOn="2026-10-27"
              href="/dev/components"
              hint={
                <span className="inline-flex flex-wrap items-center gap-x-2 rounded-badge bg-accent-soft py-0.5 pr-0.5 pl-2 text-sm text-ink">
                  We suggested a follow-up a week out. Change it anytime.
                  <Button variant="quiet" size="sm">
                    Got it
                  </Button>
                </span>
              }
            />
          </List>
        </Example>
      </Section>

      <Section title="Badge">
        <Example label="Status">
          <div className="flex flex-wrap gap-2">
            {STATUS_BADGES.map((tone) => (
              <Badge key={tone} tone={tone} />
            ))}
          </div>
        </Example>
        <Example label="Status, in its own words (Followed up looks like Applied; Rejected like Closed)">
          <div className="flex flex-wrap gap-2">
            <Badge tone="applied">Followed up</Badge>
            <Badge tone="closed">Rejected</Badge>
            <Badge tone="closed">Withdrawn</Badge>
            <Badge tone="closed">No response</Badge>
          </div>
        </Example>
        <div className="flex flex-wrap gap-x-4 gap-y-5">
          {TAGS.map(({ tone, text, note }) => (
            <Example key={note} label={note}>
              <Badge tone={tone}>{text}</Badge>
            </Example>
          ))}
        </div>
      </Section>

      <Section title="PageHeader">
        <p className="text-muted">
          The top of this page: a title, a one-line description, and Back to the parent page.
        </p>
      </Section>

      <Section title="EmptyState">
        <EmptyState title="Nothing logged yet" action={{ href: "/add", label: "Log an application" }}>
          Log each application as you send it, and it shows up here sorted by follow-up date.
        </EmptyState>
      </Section>

      <Section title="Toast">
        <p className="text-muted">
          One message at a time, for 5 seconds. Close or Escape dismisses it, and a new one
          replaces the one showing.
        </p>
        <ToastDemo />
      </Section>

      <Section title="Saved data">
        <p className="text-muted">
          Add the fictional Example Co, then reload this page: it&rsquo;s still there. Remove it
          and reload again: it&rsquo;s gone. Nothing else you&rsquo;ve saved is touched.
        </p>
        <DataDemo />
      </Section>
    </div>
  );
}

// Marks the entry this demo adds, so Remove never touches a real one.
const DEMO_NOTE = "Added from /dev/components.";

function DataDemo() {
  const data = useApplications();
  const toast = useToast();
  if (!data.hydrated) {
    return <div aria-busy="true" className="h-11 w-64 animate-pulse rounded-control bg-subtle" />;
  }
  const demo = data.applications.filter((a) => a.company === "Example Co" && a.notes === DEMO_NOTE);

  function add() {
    const day = today();
    const app = toApplication(
      { ...emptyForm(day), company: "Example Co", role: "Data Analyst", notes: DEMO_NOTE },
      day,
    );
    toast(data.add(app) ? "Added Example Co. Reload to check it's still there." : "Couldn't save. This browser's storage may be full.");
  }

  function remove() {
    const ok = demo.every((a) => data.remove(a.id));
    toast(ok ? "Removed Example Co." : "Couldn't remove it. This browser's storage may be full or blocked.");
  }

  return (
    <div className="space-y-4">
      <p>
        Saved in this browser: {data.applications.length}{" "}
        {data.applications.length === 1 ? "application" : "applications"}. Weekly goal{" "}
        {data.settings.weeklyGoal}.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={add} disabled={demo.length > 0}>
          Add Example Co
        </Button>
        <Button variant="secondary" onClick={remove} disabled={demo.length === 0}>
          Remove Example Co
        </Button>
      </div>
      {demo.length > 0 && (
        <List>
          {demo.map((a) => (
            <ListRow
              key={a.id}
              company={a.company}
              role={a.role}
              status={a.status}
              followUpOn={a.followUpOn ?? undefined}
              href={`/applications/edit?id=${a.id}&from=list`}
            />
          ))}
        </List>
      )}
    </div>
  );
}

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => toast("Backup downloaded.")}>
        Show a message
      </Button>
      <Button variant="secondary" onClick={() => toast("Copied the job posting link.")}>
        Show another
      </Button>
    </div>
  );
}

function RoleChips() {
  const [picked, setPicked] = useState<string[]>(["Data Analyst"]);
  const toggle = (role: string) =>
    setPicked((p) => (p.includes(role) ? p.filter((r) => r !== role) : [...p, role]));
  return (
    <ChipGroup label="Role suggestions">
      {ROLES.map((role) => (
        <Chip key={role} pressed={picked.includes(role)} onClick={() => toggle(role)}>
          {role}
        </Chip>
      ))}
    </ChipGroup>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-8">
      <h2 className="border-b border-line pb-2 font-serif text-heading">{title}</h2>
      {children}
    </section>
  );
}

function Example({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-label text-muted">{label}</p>
      {children}
    </div>
  );
}
