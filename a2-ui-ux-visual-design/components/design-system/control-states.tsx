import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FilterChip, Toggle } from "@/components/ui/choice";
import { filters } from "@/content/spots";
import { Specimen } from "./section";

const states = ["Rest", "Hover", "Focus", "Pressed", "Selected", "Disabled"];

const controls: { name: string; render: (state: string) => ReactNode }[] = [
  {
    name: "Primary button",
    render: (state) => (
      <Button data-state={state}>
        {state === "selected" ? "Saved" : "Find a spot"}
      </Button>
    ),
  },
  {
    name: "Secondary button",
    render: (state) => (
      <Button variant="secondary" data-state={state}>
        {state === "selected" ? "Saved" : "Save"}
      </Button>
    ),
  },
  {
    name: "Filter chip",
    render: (state) => <FilterChip data-state={state}>{filters[0]}</FilterChip>,
  },
  {
    name: "Toggle",
    render: (state) => <Toggle data-state={state}>Saved only</Toggle>,
  },
];

// Section 5. Each control in its six states, side by side. A specimen's
// look is forced with a data-state attribute; the stylesheet gives the live
// components the very same rules on real :hover, :focus-visible and :active
// (see components/ui/ui.css). The specimens are pictures: `inert` keeps the
// mouse and the keyboard from changing them.
export function ControlStates() {
  return (
    <div className="grid gap-10">
      {controls.map((control) => (
        <Specimen key={control.name} title={control.name}>
          <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {states.map((state) => (
              <li key={state}>
                <p className="ui-label">{state}</p>
                <div inert className="mt-2 flex min-h-11 items-center">
                  {control.render(state.toLowerCase())}
                </div>
              </li>
            ))}
          </ul>
        </Specimen>
      ))}
    </div>
  );
}
