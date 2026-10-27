import type { KeyboardEvent } from "react";

// Escape backs out of an inline confirmation or a small inline form, the
// same as its Cancel or Keep it button. Call it from onKeyDown on the box
// that holds the buttons: focus is inside it while it's open. It marks the
// press as handled (preventDefault), so the toast, which listens on the
// whole document, leaves its message up; stopPropagation alone can't do
// that, because Next runs React from the document too.
//   <div onKeyDown={(e) => onEscape(e, cancel)}>
export function onEscape(event: KeyboardEvent, cancel: () => void) {
  if (event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  cancel();
}
