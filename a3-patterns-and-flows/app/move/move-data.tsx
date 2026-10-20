"use client";

import { useId, useState, type FormEvent } from "react";
import { combine, plural, readBackup, toBackup, type Application } from "@/lib/applications";
import { today as getToday } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import { useBackLink } from "@/hooks/useBackLink";
import { downloadFile } from "@/lib/download";
import { Button, ButtonLink, Card, ErrorIcon, Field, Input, Loading, Notice, PageHeader } from "@/components/ui";

// localStorage stays on one browser, so moving between the phone and the
// laptop is a file: download it on one, load it on the other. Loading
// combines instead of replacing, so changes made on both survive.

type Check = { incoming: Application[]; added: number; updated: number; total: number };

function focusSoon(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.focus());
}

export function MoveData() {
  const store = useApplications();
  const back = useBackLink();
  const fileId = useId();
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [check, setCheck] = useState<Check | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  if (!store.hydrated) return <Loading />;
  const apps = store.applications;

  function download() {
    const name = `seguimiento-${getToday()}.json`;
    downloadFile(name, toBackup(apps, store.settings), "application/json");
    setDownloaded(name);
  }

  async function checkFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDone(null);
    setSaveFailed(false);
    const input = event.currentTarget.elements.namedItem("backup") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      setFileError("Choose the .json file you downloaded from Seguimiento.");
      focusSoon(fileId);
      return;
    }
    const incoming = readBackup(await file.text());
    if (!incoming) {
      setFileError(
        "This file isn't a Seguimiento backup. Download a new one on your other device and try again.",
      );
      focusSoon(fileId);
      return;
    }
    setFileError(null);
    const result = combine(apps, incoming);
    setCheck({ incoming, added: result.added, updated: result.updated, total: incoming.length });
    focusSoon("move-check");
  }

  function confirmCombine() {
    if (!check) return;
    const result = combine(apps, check.incoming);
    if (!store.replaceAll(result.applications)) {
      setSaveFailed(true);
      return;
    }
    setCheck(null);
    setDone(result.applications.length);
    focusSoon("move-done");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <PageHeader
          title="Move data"
          description="Copy your applications between your phone and your laptop with a backup file."
          back={back}
        />
        <p className="text-muted">
          Your applications are saved only in this browser. Download a backup on one device
          and load it on the other, before your Monday check-in.
        </p>
      </div>

      {done !== null && (
        <Notice id="move-done">
          <div className="space-y-3">
            <p>
              <strong>Combined.</strong> You now have {plural(done, "application")} on this
              device.
            </p>
            <ButtonLink href="/">Go to Home</ButtonLink>
          </div>
        </Notice>
      )}

      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">1. Download a backup</h2>
        {apps.length === 0 ? (
          <p className="text-muted">
            No applications on this device yet, so there&rsquo;s nothing to download.
          </p>
        ) : (
          <>
            <p>This device has {plural(apps.length, "application")}.</p>
            <Button onClick={download} className="w-full sm:w-auto">
              Download backup
            </Button>
            {downloaded && (
              <p role="status" className="text-sm">
                Downloaded <strong>{downloaded}</strong>. Now open Seguimiento on your other
                device and load it there.
              </p>
            )}
          </>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">2. Load a backup</h2>
        <form noValidate onSubmit={checkFile} className="space-y-4">
          <Field
            id={fileId}
            label="Backup file"
            hint="The .json file you downloaded from Seguimiento on your other device. Nothing changes until you confirm."
            error={fileError ?? undefined}
          >
            <Input
              name="backup"
              type="file"
              accept=".json,application/json"
              onChange={() => {
                setFileError(null);
                setCheck(null);
              }}
            />
          </Field>
          <Button type="submit" variant="secondary" className="w-full sm:w-auto">
            Check the file
          </Button>
        </form>

        {check && (
          <div id="move-check" tabIndex={-1} className="space-y-3 rounded-lg bg-accent-soft p-4">
            {check.added + check.updated === 0 ? (
              <p>
                This device already has everything in that file ({plural(check.total, "application")}).
                Nothing to combine.
              </p>
            ) : (
              <>
                <p>
                  This backup has {plural(check.total, "application")}. Loading it{" "}
                  <strong>
                    adds {check.added} and updates {check.updated}
                  </strong>
                  . Nothing is deleted.
                </p>
                <p className="text-sm text-muted">
                  When both devices changed the same application, the more recent change is kept.
                </p>
                <Button onClick={confirmCombine}>Combine</Button>
              </>
            )}
            {saveFailed && (
              <p className="flex gap-2 text-sm font-medium text-error">
                <ErrorIcon />
                Couldn&rsquo;t save the combined list. This browser&rsquo;s storage may be full.
                Nothing changed.
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
