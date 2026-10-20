"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { plural, readExport, toBackup, type Export } from "@/lib/applications";
import { dayOf, formatDay, today as getToday } from "@/lib/dates";
import { downloadFile } from "@/lib/download";
import { onEscape } from "@/lib/keys";
import { useApplications } from "@/hooks/useApplications";
import { Button, ErrorIcon, Field, Input, Notice, TextLink } from "./ui";

// The safety net at the foot of the check-in. "Export my data" downloads
// everything (applications and settings) as seguimiento-YYYY-MM-DD.json.
// "Import" reads such a file, checks its shape, says what it holds, and only
// after "Replace my data" swaps it in for everything on this device. To
// merge two devices instead, Move data combines.

const READ_ERROR = "Couldn't read that file. Choose a Seguimiento export.";

function focusSoon(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.focus());
}

export function YourData() {
  const store = useApplications();
  const fileId = useId();
  const confirmId = useId();
  const doneId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [exported, setExported] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState<Export | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  function exportData() {
    const name = `seguimiento-${getToday()}.json`;
    downloadFile(name, toBackup(store.applications, store.settings), "application/json");
    setExported(name);
  }

  async function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDone(null);
    setSaveFailed(false);
    setPending(null);
    const input = event.currentTarget.elements.namedItem("import") as HTMLInputElement;
    const file = input.files?.[0];
    const read = file ? readExport(await file.text().catch(() => "")) : null;
    if (!read) {
      setError(file ? READ_ERROR : "Choose a Seguimiento export.");
      focusSoon(fileId);
      return;
    }
    setError(undefined);
    setPending(read);
    focusSoon(confirmId);
  }

  function replace() {
    if (!pending) return;
    if (!store.replaceStore(pending.applications, pending.settings)) {
      setSaveFailed(true);
      return;
    }
    setDone(pending.applications.length);
    setPending(null);
    formRef.current?.reset();
    focusSoon(doneId);
  }

  function cancel() {
    setPending(null);
    formRef.current?.reset();
    focusSoon(fileId);
  }

  const here = store.applications.length;

  return (
    <section aria-labelledby="your-data-heading" className="space-y-4 border-t border-line pt-6">
      <div>
        <h2 id="your-data-heading" className="text-xl font-semibold">
          Your data
        </h2>
        <p className="mt-1 text-muted">
          Everything is saved only in this browser. Keep a copy, or bring one back.
        </p>
      </div>

      <div className="space-y-2">
        <Button variant="secondary" onClick={exportData}>
          Export my data
        </Button>
        <p role="status" className="text-sm text-muted">
          {exported && `Downloaded ${exported}: your applications and settings.`}
        </p>
      </div>

      {done !== null && (
        <Notice id={doneId}>
          <p>
            <strong>Imported.</strong> This device now has {plural(done, "application")} and the
            settings from the file.
          </p>
        </Notice>
      )}

      <form ref={formRef} noValidate onSubmit={check} className="space-y-3">
        <Field
          id={fileId}
          label="Import"
          hint={
            <>
              A Seguimiento export (.json). It replaces everything on this device. To merge
              with what&rsquo;s here instead, use <TextLink href="/move">Move data</TextLink>.
            </>
          }
          error={error}
        >
          <Input
            type="file"
            name="import"
            accept=".json,application/json"
            onChange={() => {
              setError(undefined);
              setPending(null);
            }}
          />
        </Field>
        {!pending && (
          <Button type="submit" variant="secondary">
            Check the file
          </Button>
        )}
      </form>

      {pending && (
        <div
          id={confirmId}
          tabIndex={-1}
          onKeyDown={(e) => onEscape(e, cancel)}
          className="space-y-3 rounded-lg border border-error bg-error-soft p-4"
        >
          <p>
            <strong>Replace everything on this device?</strong> The file has{" "}
            {plural(pending.applications.length, "application")}
            {pending.exportedAt && `, exported ${formatDay(dayOf(pending.exportedAt))}`}. The{" "}
            {plural(here, "application")} here now
            {pending.settings ? ", your weekly goal and last check-in" : ""} will be replaced.
            This can&rsquo;t be undone, so export first if you want a copy.
          </p>
          {saveFailed && (
            <p className="flex gap-2 text-sm font-medium text-error">
              <ErrorIcon />
              <span>Couldn&rsquo;t save. This browser&rsquo;s storage may be full; nothing changed.</span>
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={replace}>
              Replace my data
            </Button>
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
