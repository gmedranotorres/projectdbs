"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { addDays, formatDay, today as getToday } from "@/lib/dates";
import { SPONSORSHIP_TAGS, STATUS_LABELS, formFrom, groupOf, isOpen, markFollowedUp } from "@/lib/applications";
import { useData } from "@/hooks/useData";
import { useBackLink } from "@/hooks/useBackLink";
import { onEscape } from "@/lib/keys";
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
// Add plus Status. Once the follow-up is due, the usual change is one tap
// ("I followed up today").
// Saving stays here and says "Saved", with the follow-up date; Change, by
// the date at the top, goes straight to its field. Deleting asks first, on
// the page, then goes to the list. "← Back" goes to the list, or Home, it
// came from.

export function ApplicationDetail() {
  const store = useData();
  const router = useRouter();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const back = useBackLink();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // Set while deleting, so the page doesn't flash "not found" on its way
  // out.
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
          This application isn&rsquo;t in your list.
        </EmptyState>
      </div>
    );
  }

  const due = groupOf(app, today) === "due";

  async function followedUp() {
    if (!app) return;
    const next = await store.update(markFollowedUp(app, today));
    if (next) {
      setProblem(null);
      setRound((r) => r + 1);
      toast(`Saved. Next follow-up ${formatDay(next.followUpOn!)}.`);
    } else {
      setProblem("Couldn't save. Check your connection and try again.");
    }
  }

  function changeFollowUp() {
    const field = document.querySelector<HTMLInputElement>('#edit-section [name="followUpOn"]');
    field?.scrollIntoView({ block: "center" });
    field?.focus({ preventScroll: true });
  }

  function keep() {
    setConfirmingDelete(false);
    // Back where you were, now that the question is gone.
    requestAnimationFrame(() => document.getElementById("delete-application")?.focus());
  }

  async function remove() {
    if (!app) return;
    setLeaving(true);
    if (await store.remove(app.id)) {
      toast(`Deleted ${app.company} — ${app.role}.`);
      // replace: Back from the list shouldn't open a page that's gone.
      router.replace("/applications");
    } else {
      setLeaving(false);
      setProblem("Couldn't delete. Check your connection and try again.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <PageHeader title={app.company} description={app.role} back={back} />
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
          <Badge tone={statusTone(app.status)}>{STATUS_LABELS[app.status]}</Badge>
          <Badge>{SPONSORSHIP_TAGS[app.sponsorship]}</Badge>
          <span>Applied {formatDay(app.appliedOn)}</span>
          <span>{app.followUpOn ? `Follow up ${formatDay(app.followUpOn)}` : "No follow-up"}</span>
          {/* The date is the fifth field below; this goes straight to it. */}
          {app.followUpOn && (
            <Button variant="quiet" size="sm" onClick={changeFollowUp}>
              Change<span className="sr-only"> the follow-up date</span>
            </Button>
          )}
        </p>
      </div>

      {problem && (
        <Notice tone="error">
          <p>{problem}</p>
        </Notice>
      )}

      {/* The question only leads once the follow-up is due, as on the
          check-in. Before that, following up early is a quiet extra, so a
          just-added application doesn't open on "Did you follow up?". */}
      {due ? (
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
      ) : (
        isOpen(app.status) && (
          <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted">
            Followed up early?
            <Button variant="quiet" size="sm" onClick={followedUp}>
              I followed up today
            </Button>
          </p>
        )
      )}

      <section id="edit-section" aria-labelledby="edit-heading" className="space-y-4">
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
          onSaved={(saved) => {
            setProblem(null);
            // Say what the date is now: the field is usually out of view.
            toast(saved.followUpOn ? `Saved. Follow up ${formatDay(saved.followUpOn)}.` : "Saved.");
          }}
        />
      </section>

      <section aria-labelledby="delete-heading" className="space-y-3 border-t border-line pt-6">
        <h2 id="delete-heading" className="text-lg font-semibold">
          Delete
        </h2>
        {confirmingDelete ? (
          <div onKeyDown={(e) => onEscape(e, keep)} className="space-y-3 rounded-lg border border-error bg-error-soft p-4">
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
              <Button variant="secondary" onClick={keep}>
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
