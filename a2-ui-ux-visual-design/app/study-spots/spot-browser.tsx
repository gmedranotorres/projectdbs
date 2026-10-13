"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SpotCard } from "@/components/ui/card";
import { FilterChip } from "@/components/ui/choice";
import { ExternalIcon } from "@/components/ui/icons";
import { DetailPanel } from "@/components/ui/panel";
import {
  directionsUrl,
  filters,
  shownAddress,
  spots,
  whyIGo,
  type Filter,
  type Spot,
} from "@/content/spots";

const label = "ui-label ui-muted";

// The whole of the site below its header: the filter chips, how many spots
// match, a card for each of them, and the detail panel a card opens.
// Nothing is stored: a reload starts again from "All".
export function SpotBrowser() {
  const [filter, setFilter] = useState<Filter | "All">("All");
  const [spot, setSpot] = useState<Spot>(spots[0]);
  const [open, setOpen] = useState(false);

  const matching =
    filter === "All" ? spots : spots.filter((item) => item.filter === filter);

  return (
    <>
      <fieldset className="mt-8">
        <legend className="sr-only">Filter the spots</legend>
        <div className="ui-chip-row">
          {(["All", ...filters] as const).map((option) => (
            <FilterChip
              key={option}
              single
              name="filter"
              value={option}
              checked={filter === option}
              onChange={() => setFilter(option)}
            >
              {option}
            </FilterChip>
          ))}
        </div>
      </fieldset>

      {/* read out by screen readers each time the filter changes */}
      <p role="status" className={`${label} mt-4`}>
        {filter === "All"
          ? `${spots.length} spots`
          : `${matching.length} of ${spots.length} spots`}
      </p>

      <ul role="list" className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matching.map((item) => (
          // "grid" stretches each card to the height of its row
          <li key={item.id} className="grid">
            <SpotCard
              name={item.name}
              type={item.type}
              headingLevel={2}
              onOpen={() => {
                setSpot(item);
                setOpen(true);
              }}
            >
              <p>
                <Badge>{item.filter}</Badge>
              </p>
            </SpotCard>
          </li>
        ))}
      </ul>

      <DetailPanel
        open={open}
        onClose={() => setOpen(false)}
        title={spot.name}
        type={spot.type}
      >
        <dl className="grid gap-4">
          <div>
            <dt className={label}>Why I go</dt>
            <dd className="mt-1">{whyIGo[spot.filter]}</dd>
          </div>
          <div>
            <dt className={label}>Note</dt>
            <dd className="mt-1">{spot.note}</dd>
          </div>
          <div>
            <dt className={label}>Address</dt>
            <dd className="mt-1">{shownAddress(spot)}</dd>
          </div>
        </dl>
        <p>
          <ButtonLink
            href={directionsUrl(spot)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
            <ExternalIcon />
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </ButtonLink>
        </p>
      </DetailPanel>
    </>
  );
}
