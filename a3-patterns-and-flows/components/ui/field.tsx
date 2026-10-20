"use client";

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";

// A field: its label, an optional hint, the error, then the control. The
// error sits right above what needs fixing, where a phone keyboard won't
// cover it. Field hands its control the id, aria-describedby (the hint and
// the error) and aria-invalid, so the control inside only needs its own
// props: <Field label="Company" error={...}><Input name="company" /></Field>.
//
// The controls are Calm's, from A2: a 1px outline in the muted color that
// darkens under the pointer, 2px red when there's an error, and dashed when
// disabled. Their text is 16px so phones don't zoom in on focus.

type FieldControl = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

const FieldContext = createContext<FieldControl | null>(null);

export function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  // Pass an id to move focus to the control, such as the first error.
  id?: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = [hint ? `${fieldId}-hint` : "", error ? `${fieldId}-error` : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div>
      <label htmlFor={fieldId} className="block font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <div id={`${fieldId}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </div>
      )}
      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 flex gap-1.5 text-sm font-medium text-error">
          <ErrorIcon />
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
      <div className="mt-1.5">
        <FieldContext.Provider
          value={{
            id: fieldId,
            "aria-describedby": describedBy || undefined,
            "aria-invalid": error ? true : undefined,
          }}
        >
          {children}
        </FieldContext.Provider>
      </div>
    </div>
  );
}

export function ErrorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="currentColor">
      <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-.9 4.25h1.8v5.5H9.1v-5.5Zm.9 9a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3Z" />
    </svg>
  );
}

const control =
  "block w-full rounded-control border border-line-strong bg-surface px-4 py-2.5 text-base text-ink placeholder:text-muted state-hover:border-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-error disabled:cursor-not-allowed disabled:border-dashed disabled:border-line disabled:bg-transparent disabled:text-muted";

// "file" is for loading a backup on Move data.
export function Input({
  type = "text",
  className = "",
  ...props
}: Omit<ComponentProps<"input">, "type"> & { type?: "text" | "url" | "date" | "file" }) {
  const field = useContext(FieldContext);
  return (
    <input
      type={type}
      {...field}
      className={`${control} min-h-11 file:mr-3 file:rounded-badge file:border-0 file:bg-subtle file:px-3 file:py-1.5 file:font-medium ${className}`}
      {...props}
    />
  );
}

export function Textarea({ rows = 3, className = "", ...props }: ComponentProps<"textarea">) {
  const field = useContext(FieldContext);
  return <textarea rows={rows} {...field} className={`${control} ${className}`} {...props} />;
}

// Pass <option> elements as children. The arrow is drawn here, since the
// browser's own is hidden to match the other controls.
export function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  const field = useContext(FieldContext);
  return (
    <span className="relative block">
      <select
        {...field}
        className={`${control} peer min-h-11 cursor-pointer appearance-none pr-11 ${className}`}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 text-ink peer-disabled:text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 4.5 6 8l3.5-3.5" />
      </svg>
    </span>
  );
}
