import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, Choices, FilterChip, Radio, Toggle } from "@/components/ui/choice";
import { SelectField, TextField } from "@/components/ui/field";
import { ExternalIcon } from "@/components/ui/icons";
import { InlineLink } from "@/components/ui/link";
import { Tabs } from "@/components/ui/tabs";
import { directionsUrl, filters, siteName, spots } from "@/content/spots";
import { Specimen } from "./section";
import { SpotDemo } from "./spot-demo";

// Section 4. Every component, live, filled with the site's own content.
//
// `slug` names the style. It goes into the names of the radio groups: the
// browser treats radios with one name as one group across the whole
// document, and Next.js can keep two design system pages in it at once.
export function Gallery({
  slug,
  cardMedia,
  panelMedia,
}: {
  slug: string;
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

      <Specimen
        title="Button that is a link"
        note="For an action that goes somewhere else. The small arrow says it opens in a new tab."
      >
        <ButtonLink
          href={directionsUrl(spots[0])}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions
          <ExternalIcon />
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </ButtonLink>
      </Specimen>

      <Specimen title="Link">
        <InlineLink href="/study-spots">Open {siteName}</InlineLink>
      </Specimen>

      <Specimen title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Saved</Badge>
          <Badge tone="outline">{spots[6].type}</Badge>
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
          <Radio name={`${slug}-order`} value="a-z" defaultChecked>
            A to Z
          </Radio>
          <Radio name={`${slug}-order`} value="z-a">
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

      <Specimen
        title="Filter chips, one choice"
        note="Picking one unpicks the others, and the arrow keys move between them. These are the site’s filters."
      >
        <fieldset>
          <legend className="sr-only">Filter the spots</legend>
          <div className="ui-chip-row">
            {["All", ...filters].map((option, index) => (
              <FilterChip
                key={option}
                single
                name={`${slug}-one-filter`}
                value={option}
                defaultChecked={index === 0}
              >
                {option}
              </FilterChip>
            ))}
          </div>
        </fieldset>
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
