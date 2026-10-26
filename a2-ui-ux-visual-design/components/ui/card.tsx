"use client";

import type { MouseEvent, ReactNode } from "react";
import "./ui.css";

// A card for one study spot: an optional picture, a small label, the
// spot's name, and whatever else it needs. `media` runs edge to edge across
// the top; `picture` is framed inside the card instead (see Picture).
//
// With `onOpen`, the whole card opens something: its name becomes a button
// stretched over the card, so a click anywhere on it, or Enter or Space
// while it has the focus, calls `onOpen`. The card is then the thing that
// shows hover, focus and press. `data-state` forces one of those looks
// ("hover", "focus", "pressed") for the design system pages.
export function SpotCard({
  name,
  type,
  media,
  picture,
  actions,
  children,
  onOpen,
  headingLevel = 3,
  "data-state": forced,
}: {
  name: string;
  // a small label above the name, such as "Library"
  type?: string;
  // a picture drawn in code, or a photo
  media?: ReactNode;
  picture?: ReactNode;
  // the card's buttons, for a card that does not open as a whole
  actions?: ReactNode;
  // anything else about the spot, such as a badge
  children?: ReactNode;
  onOpen?: () => void;
  headingLevel?: 2 | 3 | 4;
  "data-state"?: string;
}) {
  const Heading = `h${headingLevel}` as const;
  const open = (event: MouseEvent<HTMLButtonElement>) => {
    // Some browsers do not focus a button when it is clicked. Focusing it
    // here means the focus has somewhere to return to when the panel closes.
    event.currentTarget.focus();
    onOpen?.();
  };
  return (
    <article
      className="ui-card"
      data-interactive={onOpen ? "" : undefined}
      data-state={forced}
    >
      {media && <div className="ui-card-media">{media}</div>}
      {picture && <Picture>{picture}</Picture>}
      <div className="ui-card-body">
        {type && <p className="ui-label ui-muted">{type}</p>}
        <Heading className="ui-heading">
          {onOpen ? (
            <button type="button" className="ui-card-trigger" onClick={open}>
              {name}
            </button>
          ) : (
            name
          )}
        </Heading>
        {children}
        {actions && <div className="ui-card-actions">{actions}</div>}
      </div>
      {onOpen && <span className="ui-card-arrow" aria-hidden="true" />}
    </article>
  );
}

// A photo or a drawing in a 4:3 frame, with rounded corners and the theme's
// thin line around it. A photo inside should fill it (next/image's `fill`).
export function Picture({ children }: { children: ReactNode }) {
  return <div className="ui-picture">{children}</div>;
}
