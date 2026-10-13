"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import "./ui.css";

// Tabs: one row of labels, one panel showing at a time. With the keyboard,
// Tab moves into the row, the left and right arrows (and Home and End)
// change tab, and Tab again moves on into the panel.
export function Tabs({
  label,
  tabs,
}: {
  // what the row of tabs is for, read out by screen readers
  label: string;
  tabs: { label: string; content: ReactNode }[];
}) {
  const [selected, setSelected] = useState(0);
  const id = useId();

  const onKeyDown = (event: KeyboardEvent) => {
    const last = tabs.length - 1;
    const next = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="ui-tab-list">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            className="ui-tab"
            aria-selected={index === selected}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          className="ui-tab-panel"
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selected}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
