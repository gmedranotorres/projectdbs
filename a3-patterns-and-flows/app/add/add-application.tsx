"use client";

import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { emptyForm, type Application, type FormValues } from "@/lib/applications";
import { clearAddDraft, hasAddDraft, readAddDraft, saveAddDraft } from "@/lib/remember";
import { today as getToday } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import { useBackLink } from "@/hooks/useBackLink";
import { ApplicationForm } from "@/components/application-form";
import { Button, Loading, PageHeader, useToast } from "@/components/ui";

// Log an application. Save application confirms with a toast and goes to
// the list, with the new one on top. Save and add another confirms the same
// way and gives a fresh form, for logging several between classes.
//
// What's typed is kept as a draft as you go, so leaving by mistake (a tap
// on the nav, a closed tab) loses nothing: coming back restores it with
// "Restored your draft". Saving clears it, and so does Start over.
export function AddApplication() {
  const store = useApplications();
  const router = useRouter();
  const toast = useToast();
  const back = useBackLink();
  // Read once, in the browser; the server only draws the loading state.
  const [draft, setDraft] = useState<FormValues | null>(() =>
    typeof window === "undefined" ? null : readAddDraft(getToday()),
  );
  const [showRestored, setShowRestored] = useState(draft !== null);
  const keepDraft = useCallback((values: FormValues) => saveAddDraft(values, getToday()), []);
  // A new key gives a fresh, empty form, with the cursor in Company.
  const [round, setRound] = useState(0);

  // Next keeps a visited page and shows it again when you come back, with
  // what was typed still in it. As it's hidden (this cleanup runs then, per
  // Next's "Preserving UI state" guide): after Save application, reset to
  // a fresh form; with a draft left behind, say "Restored your draft" when
  // the page comes back, the same as after a reload.
  const savedAndLeft = useRef(false);
  useLayoutEffect(() => {
    return () => {
      if (savedAndLeft.current) {
        savedAndLeft.current = false;
        setRound((r) => r + 1);
      } else if (hasAddDraft()) {
        setShowRestored(true);
      }
    };
  }, []);

  if (!store.hydrated) return <Loading />;
  const today = getToday();

  function onSaved(app: Application, another: boolean) {
    clearAddDraft();
    setDraft(null);
    setShowRestored(false);
    toast(`Added ${app.company} — ${app.role}.`);
    if (another) {
      setRound((r) => r + 1);
    } else {
      // replace, not push: the list takes the form's place in the history,
      // so Back goes to where the person came from, not to a filled form.
      savedAndLeft.current = true;
      router.replace(`/applications?new=${app.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Log an application"
        description="Company and role are all you need; the dates are filled in for you."
        back={back}
      />
      {showRestored && (
        <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted">
          Restored your draft
          <Button
            variant="quiet"
            size="sm"
            onClick={() => {
              clearAddDraft();
              setDraft(null);
              setShowRestored(false);
              // A fresh, empty form, with the cursor in Company.
              setRound((r) => r + 1);
            }}
          >
            Start over
          </Button>
        </p>
      )}
      <ApplicationForm
        key={round}
        mode="add"
        initial={draft && round === 0 ? draft : emptyForm(today)}
        applications={store.applications}
        today={today}
        submitLabel="Save application"
        addAnotherLabel="Save and add another"
        autoFocus={round > 0}
        onSaved={onSaved}
        onChange={keepDraft}
      />
    </div>
  );
}
