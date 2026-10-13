"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconButton } from "./button";
import { CloseIcon } from "./icons";
import "./ui.css";

// A detail panel: a sheet that opens over the page (on the right on wide
// screens, at the bottom on phones) and closes with Escape or the × button.
//
// It is a real modal <dialog>, so the browser does the hard parts: it keeps
// the keyboard inside the panel while it is open, closes it on Escape, and
// puts the focus back on the button that opened it.
export function DetailPanel({
  open,
  onClose,
  title,
  type,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  // a small label above the title, such as "Library"
  type?: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    dialog.showModal();
    // Also runs when the visitor leaves the page with the panel open:
    // Next.js keeps a hidden page mounted, and an open modal there would
    // block the page they went to.
    return () => dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="ui-panel"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <div className="ui-panel-header">
        <div className="ui-panel-title">
          {type && <p className="ui-label ui-muted">{type}</p>}
          <h2 className="ui-heading" id={titleId}>
            {title}
          </h2>
        </div>
        <IconButton label="Close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="ui-panel-body">{children}</div>
    </dialog>
  );
}
