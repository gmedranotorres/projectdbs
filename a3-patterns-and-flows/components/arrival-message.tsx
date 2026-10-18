"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { STATUS_LABELS, isOpen, type Application } from "@/lib/applications";
import { formatDay } from "@/lib/dates";
import { Notice } from "./ui";

// The confirmation after coming back from Add or Update: the page you land
// on says what just happened. ?new=, ?updated= and ?deleted= carry it.
export function arrivalText(params: Pick<URLSearchParams, "get">, apps: Application[]): string | null {
  const find = (id: string | null) => apps.find((a) => a.id === id);

  const added = find(params.get("new"));
  if (added) {
    return added.followUpOn
      ? `Added ${added.company}. Follow up on ${formatDay(added.followUpOn)}.`
      : `Added ${added.company}.`;
  }
  const updated = find(params.get("updated"));
  if (updated) {
    return isOpen(updated.status) && updated.followUpOn
      ? `Updated ${updated.company}. Next follow-up ${formatDay(updated.followUpOn)}.`
      : `Updated ${updated.company}. It's closed as ${STATUS_LABELS[updated.status]}.`;
  }
  const deleted = params.get("deleted");
  if (deleted) return `Deleted ${deleted}.`;
  return null;
}

export function ArrivalMessage({ apps }: { apps: Application[] }) {
  const params = useSearchParams();
  const text = arrivalText(params, apps);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (text) ref.current?.focus();
  }, [text]);

  if (!text) return null;
  return (
    <Notice ref={ref}>
      <p>{text}</p>
    </Notice>
  );
}

// The id of the row to highlight, if the page was reached after a change.
export function useHighlightId(): string | null {
  const params = useSearchParams();
  return params.get("new") ?? params.get("updated");
}
