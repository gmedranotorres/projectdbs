"use client";

import { useState, type ReactNode } from "react";
import { OPEN_STATUSES, STATUS_LABELS } from "@/lib/applications";
import {
  Button,
  Chip,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui";

// Every shared form component in every state, side by side. Hover, focus
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

export function ComponentGallery() {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Components"
        description="Every shared component in every state. This page isn't in the navigation."
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
    </div>
  );
}

function RoleChips() {
  const [picked, setPicked] = useState<string[]>(["Data Analyst"]);
  const toggle = (role: string) =>
    setPicked((p) => (p.includes(role) ? p.filter((r) => r !== role) : [...p, role]));
  return (
    <div role="group" aria-label="Role suggestions" className="flex flex-wrap gap-2">
      {ROLES.map((role) => (
        <Chip key={role} pressed={picked.includes(role)} onClick={() => toggle(role)}>
          {role}
        </Chip>
      ))}
    </div>
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
