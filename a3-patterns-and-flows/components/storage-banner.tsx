"use client";

import { dismissRecovered, useStore } from "@/lib/store";
import { Button, ErrorIcon, TextLink } from "./ui";

// Problems with saving, shown on every page so they can't be missed.
export function StorageBanner() {
  const store = useStore();
  if (!store) return null;

  if (store.saving === "unavailable") {
    return (
      <div role="alert" className="border-b border-error bg-error-soft">
        <p className="mx-auto flex max-w-3xl gap-2 px-4 py-3 text-sm">
          <ErrorIcon />
          <span>
            <strong>This browser isn&rsquo;t saving.</strong> Anything you add will be gone
            when you close this tab. Open Seguimiento in a regular window (not private), or
            allow this site to store data.
          </span>
        </p>
      </div>
    );
  }

  if (store.recovered) {
    return (
      <div role="alert" className="border-b border-error bg-error-soft">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center">
          <p className="flex flex-1 gap-2">
            <ErrorIcon />
            <span>
              <strong>Some saved data couldn&rsquo;t be read.</strong> A copy was set aside and
              your list continues with what could be read. If you have a backup,{" "}
              <TextLink href="/move">load it on Move data</TextLink>.
            </span>
          </p>
          <Button variant="secondary" onClick={dismissRecovered}>
            Dismiss
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
