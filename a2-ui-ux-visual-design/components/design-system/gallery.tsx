import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, Choices, FilterChip, Radio, Toggle } from "@/components/ui/choice";
import { SelectField, TextField } from "@/components/ui/field";
import { InlineLink } from "@/components/ui/link";
import { Tabs } from "@/components/ui/tabs";
import { filters, siteName, spots } from "@/content/spots";
import { Specimen } from "./section";
import { SpotDemo } from "./spot-demo";

// Section 4. Every component, live, filled with the site's own content.
export function Gallery({
  cardMedia,
  panelMedia,
}: {
  cardMedia: ReactNode;
  panelMedia: ReactNode;
}) {
  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
      <Specimen title="Buttons" note="Primary for the one main action, secondary for the rest.">
        <div className="flex flex-wrap gap-2">
          <Button>Find a spot</Button>
          <Button variant="secondary">Save</Button>
        </div>
      </Specimen>

      <Specimen title="Link">
        <InlineLink href="/study-spots">Open {siteName}</InlineLink>
      </Specimen>

      <Specimen title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Saved</Badge>
          <Badge tone="outline">{spots[6].kind}</Badge>
          <Badge tone="strong">{spots.length} spots</Badge>
        </div>
      </Specimen>

      <Specimen title="Text input">
        <TextField
          label="Search spots"
          name="search"
          placeholder="Search by name"
          hint={`Try “${spots[0].name.split(" ")[0]}”.`}
          autoComplete="off"
        />
      </Specimen>

      <Specimen title="Select">
        <SelectField label="Spot" name="spot" defaultValue="">
          <option value="" disabled>
            Choose a spot
          </option>
          {spots.map((spot) => (
            <option key={spot.id} value={spot.id}>
              {spot.name}
            </option>
          ))}
        </SelectField>
      </Specimen>

      <Specimen title="Toggle">
        <Toggle name="saved-only">Saved only</Toggle>
      </Specimen>

      <Specimen title="Checkbox">
        <Choices legend="Filters">
          {filters.map((filter, index) => (
            <Checkbox key={filter} name="filter" value={filter} defaultChecked={index === 0}>
              {filter}
            </Checkbox>
          ))}
        </Choices>
      </Specimen>

      <Specimen title="Radios">
        <Choices legend="Order">
          <Radio name="order" value="a-z" defaultChecked>
            A to Z
          </Radio>
          <Radio name="order" value="z-a">
            Z to A
          </Radio>
        </Choices>
      </Specimen>

      <Specimen title="Filter chips" note="Each one switches on and off.">
        <div className="ui-chip-row">
          {filters.map((filter, index) => (
            <FilterChip key={filter} name="chip" value={filter} defaultChecked={index === 0}>
              {filter}
            </FilterChip>
          ))}
        </div>
      </Specimen>

      <Specimen title="Tabs" note="The arrow keys change tab.">
        <Tabs
          label="Views"
          tabs={[
            {
              label: "All spots",
              content: <p>All {spots.length} spots show here.</p>,
            },
            {
              label: "Saved",
              content: <p>The spots you save show here.</p>,
            },
          ]}
        />
      </Specimen>

      <SpotDemo cardMedia={cardMedia} panelMedia={panelMedia} />
    </div>
  );
}
