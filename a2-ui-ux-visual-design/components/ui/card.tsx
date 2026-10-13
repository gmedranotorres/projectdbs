import type { ReactNode } from "react";
import "./ui.css";

// A card for one study spot: an optional picture, a small label, the
// spot's name, and its actions.
export function SpotCard({
  name,
  kind,
  media,
  actions,
  children,
  headingLevel = 3,
}: {
  name: string;
  kind?: string;
  // a picture drawn in code, or a photo
  media?: ReactNode;
  // the card's buttons
  actions?: ReactNode;
  // any text about the spot
  children?: ReactNode;
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className="ui-card">
      {media && <div className="ui-card-media">{media}</div>}
      <div className="ui-card-body">
        {kind && <p className="ui-label ui-muted">{kind}</p>}
        <Heading className="ui-heading">{name}</Heading>
        {children}
        {actions && <div className="ui-card-actions">{actions}</div>}
      </div>
    </article>
  );
}
