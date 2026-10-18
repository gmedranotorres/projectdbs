"use client";

import { useEffect, useRef, useState } from "react";
import { emptyForm, type Application } from "@/lib/applications";
import { formatDay, today as getToday } from "@/lib/dates";
import { useStore } from "@/lib/store";
import { ApplicationForm } from "@/components/application-form";
import { Button, ButtonLink, Loading, TextLink } from "@/components/ui";

// Log an application. After saving, the page says when the follow-up is
// and offers "Add another" first, for logging several between classes.
export function AddApplication() {
  const store = useStore();
  const [saved, setSaved] = useState<Application | null>(null);
  // A new key gives "Add another" a fresh, empty form.
  const [round, setRound] = useState(0);

  if (!store) return <Loading />;
  const today = getToday();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Log an application</h1>
      {saved ? (
        <Saved
          app={saved}
          onAddAnother={() => {
            setSaved(null);
            setRound((r) => r + 1);
          }}
        />
      ) : (
        <ApplicationForm
          key={round}
          mode="add"
          initial={emptyForm(today)}
          applications={store.applications}
          today={today}
          submitLabel="Save application"
          autoFocus={round > 0}
          onSaved={setSaved}
        />
      )}
    </div>
  );
}

function Saved({ app, onAddAnother }: { app: Application; onAddAnother: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);

  return (
    <div ref={ref} tabIndex={-1} className="space-y-5 rounded-xl border border-accent/40 bg-accent-soft p-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Saved</h2>
        <p>
          Follow up with {app.contact ? `${app.contact} at ${app.company}` : app.company} on{" "}
          <strong>{formatDay(app.followUpOn!)}</strong>. It will be on your list that week.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onAddAnother}>Add another</Button>
        <ButtonLink variant="secondary" href="/">
          See this week
        </ButtonLink>
      </div>
      <p>
        <TextLink href={`/applications?new=${app.id}`}>See it in your list</TextLink>
      </p>
    </div>
  );
}
