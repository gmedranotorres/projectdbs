"use client";

import type { Application } from "@/lib/applications";
import { useFromHere } from "@/hooks/useBackLink";
import { Button, ButtonLink, Notice } from "./ui";

// Shown under Company when a saved application has the same company and
// role. It's a notice, not an error: saving still works. "Open it" goes to
// the saved one; the second button (on Add, "Add anyway") hides the notice
// for this company and role. The region is always in the page, so screen
// readers hear the notice when it appears.
export function DuplicateNotice({
  match,
  dismissLabel,
  onDismiss,
}: {
  match: Application | undefined;
  dismissLabel: string;
  onDismiss: () => void;
}) {
  const here = useFromHere();
  return (
    <div aria-live="polite">
      {match && (
        <Notice>
          <div className="space-y-3">
            <p>
              You already have {match.company} — {match.role}.
            </p>
            <div className="flex flex-wrap gap-2">
              <ButtonLink variant="secondary" size="sm" href={`/applications/${match.id}?from=${here}`}>
                Open it
              </ButtonLink>
              <Button variant="quiet" size="sm" onClick={onDismiss}>
                {dismissLabel}
              </Button>
            </div>
          </div>
        </Notice>
      )}
    </div>
  );
}
