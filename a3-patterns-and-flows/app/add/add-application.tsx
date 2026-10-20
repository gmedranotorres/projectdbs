"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { emptyForm, type Application } from "@/lib/applications";
import { today as getToday } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationForm } from "@/components/application-form";
import { Loading, PageHeader, useToast } from "@/components/ui";

// Log an application. Save application confirms with a toast and goes to
// the list, with the new one on top. Save and add another confirms the same
// way and gives a fresh form, for logging several between classes.
export function AddApplication() {
  const store = useApplications();
  const router = useRouter();
  const toast = useToast();
  // A new key gives a fresh, empty form, with the cursor in Company.
  const [round, setRound] = useState(0);

  if (!store.hydrated) return <Loading />;
  const today = getToday();

  function onSaved(app: Application, another: boolean) {
    toast(`Added ${app.company} — ${app.role}.`);
    if (another) {
      setRound((r) => r + 1);
    } else {
      // replace, not push: the list takes the form's place in the history,
      // so Back goes to where the person came from, not to a filled form.
      router.replace(`/applications?new=${app.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Log an application" back={{ href: "/", label: "Home" }} />
      <ApplicationForm
        key={round}
        mode="add"
        initial={emptyForm(today)}
        applications={store.applications}
        today={today}
        submitLabel="Save application"
        addAnotherLabel="Save and add another"
        autoFocus={round > 0}
        onSaved={onSaved}
      />
    </div>
  );
}
