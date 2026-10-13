"use client";

import { useId, type ComponentProps } from "react";
import "./ui.css";

// These two are client components for one reason: the id that ties a label
// to its field is generated here, and ids generated on the server can
// repeat across pages that Next.js keeps mounted at the same time.

// A text input with its label above and an optional hint below.
export function TextField({
  label,
  hint,
  id,
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string }) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className="ui-field">
      <label className="ui-label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        className="ui-input"
        id={fieldId}
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        {...props}
      />
      {hint && (
        <p className="ui-field-hint" id={`${fieldId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

// A select with its label above. Pass <option> elements as children.
export function SelectField({
  label,
  id,
  children,
  ...props
}: ComponentProps<"select"> & { label: string }) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className="ui-field">
      <label className="ui-label" htmlFor={fieldId}>
        {label}
      </label>
      <span className="ui-select-wrap">
        <select className="ui-select" id={fieldId} {...props}>
          {children}
        </select>
      </span>
    </div>
  );
}
