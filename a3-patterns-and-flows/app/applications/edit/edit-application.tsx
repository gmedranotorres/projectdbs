"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addDays, formatDay, today as getToday } from "@/lib/dates";
import { formFrom, isOpen, markFollowedUp } from "@/lib/applications";
import { deleteApplication, saveApplication, useStore } from "@/lib/store";
import { ApplicationForm } from "@/components/application-form";
import { Button, ButtonLink, Card, ErrorIcon, Loading, Notice, PageHeader } from "@/components/ui";

// Update one application. The usual update is one tap ("I followed up
// today"); everything else is the same form as Add, plus status and delete.
// Saving goes back to the page you came from, which says what changed;
// "← Back" always goes to the list, the page's parent.
const PARENT = { href: "/applications", label: "All applications" };

export function EditApplication() {
  const store = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // Set while deleting, so the page doesn't flash "not found" on its way out.
  const [leaving, setLeaving] = useState(false);

  const id = params.get("id");
  const back = params.get("from") === "week" ? "/" : "/applications";

  if (!store) return <Loading />;
  const today = getToday();
  const app = store.applications.find((a) => a.id === id);

  if (!app && leaving) return <Loading />;
  if (!app) {
    return (
      <div className="space-y-6">
        <PageHeader title="Application not found" back={PARENT} />
        <Notice tone="error">
          <p className="flex gap-2">
            <ErrorIcon />
            <span>
              We can&rsquo;t find this application. It may have been deleted, or saved in a
              different browser. To bring it over from another device, use Move data.
            </span>
          </p>
        </Notice>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/applications">Back to your list</ButtonLink>
          <ButtonLink variant="secondary" href="/move">
            Move data
          </ButtonLink>
        </div>
      </div>
    );
  }

  function followedUp() {
    if (!app) return;
    const next = markFollowedUp(app, today);
    if (saveApplication(next)) router.push(`${back}?updated=${next.id}`);
    else setProblem("Couldn't save. This browser's storage may be full.");
  }

  function remove() {
    if (!app) return;
    setLeaving(true);
    if (deleteApplication(app.id)) {
      router.push(`${back}?deleted=${encodeURIComponent(app.company)}`);
    } else {
      setLeaving(false);
      setProblem("Couldn't delete. This browser's storage may be full or blocked.");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title={app.company} description={app.role} back={PARENT} />

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
            {formatDay(addDays(today, 14))}, 2 weeks from today.
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
          mode="edit"
          initial={formFrom(app)}
          before={app}
          applications={store.applications}
          today={today}
          submitLabel="Save changes"
          afterSubmit={
            <ButtonLink variant="secondary" href={back}>
              Cancel
            </ButtonLink>
          }
          onSaved={(saved) => router.push(`${back}?updated=${saved.id}`)}
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
              pick a closed status above instead.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="danger" onClick={remove} autoFocus>
                Delete it
              </Button>
              <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>
                Keep it
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
            Delete application
          </Button>
        )}
      </section>
    </div>
  );
}
