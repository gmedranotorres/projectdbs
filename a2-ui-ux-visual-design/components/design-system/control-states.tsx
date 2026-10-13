"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotCard } from "@/components/ui/card";
import { FilterChip, Toggle } from "@/components/ui/choice";
import { filters, spots } from "@/content/spots";
import { Specimen } from "./section";

const sixStates = ["Rest", "Hover", "Focus", "Pressed", "Selected", "Disabled"];

type Control = {
  name: string;
  note?: string;
  // the states it has, when not all six
  states?: string[];
  // a large control gets fewer, wider columns
  large?: boolean;
  render: (state: string) => ReactNode;
};

const controls: Control[] = [
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
  {
    name: "Card that opens",
    note: "A card is never selected or disabled, so it has four states.",
    states: ["Rest", "Hover", "Focus", "Pressed"],
    large: true,
    render: (state) => (
      // A picture of the card: it opens nothing.
      <SpotCard
        name={spots[6].name}
        type={spots[6].type}
        headingLevel={4}
        data-state={state}
        onOpen={() => {}}
      >
        <p>
          <Badge>{spots[6].filter}</Badge>
        </p>
      </SpotCard>
    ),
  },
];

// Section 5. Each control in its states, side by side. A specimen's look is
// forced with a data-state attribute; the stylesheet gives the live
// components the very same rules on real :hover, :focus-visible and :active
// (see components/ui/ui.css). The specimens are pictures: `inert` keeps the
// mouse and the keyboard from changing them.
//
// This is a client component only because the card specimen is given a
// function (one that does nothing), and functions cannot be handed from the
// server to the browser.
export function ControlStates() {
  return (
    <div className="grid gap-10">
      {controls.map((control) => (
        <Specimen key={control.name} title={control.name} note={control.note}>
          <ul
            role="list"
            className={
              control.large
                ? "grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4"
                : "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6"
            }
          >
            {(control.states ?? sixStates).map((state) => (
              <li key={state}>
                <p className="ui-label">{state}</p>
                <div
                  inert
                  className={
                    control.large ? "mt-2" : "mt-2 flex min-h-11 items-center"
                  }
                >
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
