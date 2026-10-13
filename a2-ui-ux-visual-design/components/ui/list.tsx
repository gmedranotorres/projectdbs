import type { ComponentProps, ReactNode } from "react";
import "./ui.css";

// A list of rows with a thin line between them.
export function List({ children }: { children: ReactNode }) {
  return (
    <ul role="list" className="ui-list">
      {children}
    </ul>
  );
}

// One row: a title, a quieter note beside it, and an arrow, because a row
// opens something when pressed.
export function ListRow({
  title,
  note,
  ...props
}: ComponentProps<"button"> & { title: string; note?: string }) {
  return (
    <li>
      <button type="button" className="ui-row" {...props}>
        <span className="ui-row-title">{title}</span>
        {note && <span className="ui-label ui-muted">{note}</span>}
      </button>
    </li>
  );
}
