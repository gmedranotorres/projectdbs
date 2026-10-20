"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { addDays, formatDay, today as getToday } from "@/lib/dates";
import { STATUS_LABELS, formFrom, isOpen, markFollowedUp } from "@/lib/applications";
import { useApplications } from "@/hooks/useApplications";
import { useBackLink } from "@/hooks/useBackLink";
import { ApplicationForm } from "@/components/application-form";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Loading,
  Notice,
  PageHeader,
  TextLink,
  statusTone,
  useToast,
} from "@/components/ui";

// One application: what's saved, then every field to change, the same as
// Add plus Status. The usual change is one tap ("I followed up today").
// Saving stays here and says "Saved"; deleting asks first, on the page,
// then goes to the list. "← Back" goes to the list, or Home, it came from.

export function ApplicationDetail() {
  const store = useApplications();
  const router = useRouter();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const back = useBackLink();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // Set while deleting, so the page doesn't flash "not on this device" on
  // its way out.
  const [leaving, setLeaving] = useState(false);
  // A new key refills the form after "I followed up today" changes the
  // saved dates.
  const [round, setRound] = useState(0);

  if (!store.hydrated) return <Loading />;
  const today = getToday();
  const app = store.applications.find((a) => a.id === id);

  if (!app && leaving) return <Loading />;
  if (!app) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Not found"
          description="Check the address, or find it in your list."
          back={back}
        />
        <EmptyState action={<TextLink href="/applications">See all applications</TextLink>}>
          This application isn&rsquo;t on this device.
        </EmptyState>
      </div>
    );
  }

  function followedUp() {
    if (!app) return;
    const next = markFollowedUp(app, today);
    if (store.update(next)) {
      setProblem(null);
      setRound((r) => r + 1);
      toast(`Saved. Next follow-up ${formatDay(next.followUpOn!)}.`);
    } else {
      setProblem("Couldn't save. This browser's storage may be full.");
    }
  }

  function remove() {
    if (!app) return;
    setLeaving(true);
    if (store.remove(app.id)) {
      toast(`Deleted ${app.company} — ${app.role}.`);
      // replace: Back from the list shouldn't open a page that's gone.
      router.replace("/applications");
    } else {
      setLeaving(false);
      setProblem("Couldn't delete. This browser's storage may be full or blocked.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <PageHeader title={app.company} description={app.role} back={back} />
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
          <Badge tone={statusTone(app.status)}>{STATUS_LABELS[app.status]}</Badge>
          <span>Applied {formatDay(app.appliedOn)}</span>
          <span>{app.followUpOn ? `Follow up ${formatDay(app.followUpOn)}` : "No follow-up"}</span>
        </p>
      </div>

      {problem && (
        <Notice tone="error">
          <p>{problem}</p>
        </Notice>
      )}

      {isOpen(app.status) && (
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Did you follow up?</h2>
          <p className="text-muted">
            One tap marks it, and the next follow-up moves to{" "}
            {formatDay(addDays(today, 7))}, a week from today.
          </p>
          <Button onClick={followedUp} className="w-full sm:w-auto">
            I followed up today
          </Button>
        </Card>
      )}

      <section aria-labelledby="edit-heading" className="space-y-4">
        <h2 id="edit-heading" className="text-xl font-semibold">
          Change details or status
        </h2>
        <ApplicationForm
          key={`${app.id}-${round}`}
          mode="edit"
          initial={formFrom(app)}
          before={app}
          applications={store.applications}
          today={today}
          submitLabel="Save changes"
          afterSubmit={
            <ButtonLink variant="secondary" href={back.href}>
              Cancel
            </ButtonLink>
          }
          onSaved={() => {
            setProblem(null);
            toast("Saved");
          }}
        />
      </section>

      <section aria-labelledby="delete-heading" className="space-y-3 border-t border-line pt-6">
        <h2 id="delete-heading" className="text-lg font-semibold">
          Delete
        </h2>
        {confirmingDelete ? (
          <div className="space-y-3 rounded-lg border border-error bg-error-soft p-4">
            <p>
              <strong>
                Delete {app.role} at {app.company}?
              </strong>{" "}
              This can&rsquo;t be undone. If you just heard back, closing it keeps the record:
              choose Closed under Status instead.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="danger" onClick={remove} autoFocus>
                Delete it
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmingDelete(false);
                  // Back where you were, now that the question is gone.
                  requestAnimationFrame(() => document.getElementById("delete-application")?.focus());
                }}
              >
                Keep it
              </Button>
            </div>
          </div>
        ) : (
          <Button id="delete-application" variant="danger" onClick={() => setConfirmingDelete(true)}>
            Delete application
          </Button>
        )}
      </section>
    </div>
  );
}
