"use client";

import { useData } from "@/hooks/useData";
import { Button, ErrorIcon } from "./ui";

// A problem reading saved data, shown on every page so it can't be missed.
export function StorageBanner() {
  const store = useData();
  if (!store.loadFailed) return null;

  return (
    <div role="alert" className="border-b border-error bg-error-soft">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center">
        <p className="flex flex-1 gap-2">
          <ErrorIcon />
          <span>
            <strong>Couldn&rsquo;t load your applications.</strong> Nothing is lost. Check your
            connection, then try again.
          </span>
        </p>
        <Button variant="secondary" onClick={store.retry}>
          Try again
        </Button>
      </div>
    </div>
  );
}
