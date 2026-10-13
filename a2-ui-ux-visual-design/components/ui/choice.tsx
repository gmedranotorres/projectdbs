import type { ComponentProps, ReactNode } from "react";
import "./ui.css";

// Checkbox, radio, toggle and filter chip. All four are a real checkbox or
// radio underneath, so they work with the keyboard, with forms and without
// JavaScript. Pass `checked` and `onChange` to control one from the site,
// or `defaultChecked` to let it keep its own state.
//
// `data-state` forces a look ("hover", "focus", "pressed", "selected",
// "disabled") for the design system pages.

type InputProps = Omit<ComponentProps<"input">, "type" | "children">;
type Forced = { "data-state"?: string };

export function Checkbox({
  children,
  ...props
}: InputProps & { children: ReactNode }) {
  return (
    <label className="ui-check">
      <input type="checkbox" className="ui-check-input" {...props} />
      {children}
    </label>
  );
}

export function Radio({
  children,
  ...props
}: InputProps & { children: ReactNode }) {
  return (
    <label className="ui-check">
      <input type="radio" className="ui-check-input" {...props} />
      {children}
    </label>
  );
}

// A group of checkboxes or radios under one question.
export function Choices({
  legend,
  children,
}: {
  legend: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="ui-choices">
      <legend className="ui-label">{legend}</legend>
      {children}
    </fieldset>
  );
}

// A switch: on or off, with the change taking effect at once.
export function Toggle({
  children,
  "data-state": forced,
  ...props
}: InputProps & Forced & { children: ReactNode }) {
  return (
    <label className="ui-toggle" data-state={forced}>
      {children}
      <input type="checkbox" role="switch" {...props} />
      <span className="ui-toggle-track" aria-hidden="true">
        <span className="ui-toggle-thumb" />
      </span>
    </label>
  );
}

// A filter that can be switched on and off. A check appears when it is on,
// so color is not the only sign. With `single`, chips that share a `name`
// work as one choice: switching one on switches the others off, and the
// arrow keys move between them.
export function FilterChip({
  children,
  single = false,
  "data-state": forced,
  ...props
}: InputProps & Forced & { children: ReactNode; single?: boolean }) {
  return (
    <label className="ui-chip" data-state={forced}>
      <input type={single ? "radio" : "checkbox"} {...props} />
      <span className="ui-chip-mark" aria-hidden="true" />
      {children}
    </label>
  );
}
