"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Picture, SpotCard } from "@/components/ui/card";
import { FilterChip } from "@/components/ui/choice";
import { ExternalIcon } from "@/components/ui/icons";
import { DetailPanel } from "@/components/ui/panel";
import { StateMessage } from "@/components/ui/states";
import {
  alsoBadge,
  alsoOptions,
  directionsUrl,
  filters,
  shownAddress,
  spots,
  whyIGo,
  type Also,
  type Filter,
  type Spot,
} from "@/content/spots";
import { SpotPicture } from "./spot-picture";

const label = "ui-label ui-muted";

// The whole of the site below its header: the two rows of filter chips, how
// many spots match, a card for each of them (or the empty state when none
// do), and the detail panel a card opens.
// Nothing is stored: a reload starts again from "All" with "Also" off.
export function SpotBrowser() {
  const [filter, setFilter] = useState<Filter | "All">("All");
  const [also, setAlso] = useState<Also[]>([]);
  const [spot, setSpot] = useState<Spot>(spots[0]);
  const [open, setOpen] = useState(false);
  const allChip = useRef<HTMLInputElement>(null);

  // a spot shows when it is good for the chosen filter and has every
  // "Also" that is on
  const matching = spots.filter(
    (item) =>
      (filter === "All" || item.filter === filter) &&
      also.every((option) => item.also.includes(option)),
  );
  const filtered = filter !== "All" || also.length > 0;

  const toggleAlso = (option: Also) =>
    setAlso(
      also.includes(option)
        ? also.filter((item) => item !== option)
        : [...also, option],
    );

  const clearFilters = () => {
    setFilter("All");
    setAlso([]);
    // the button goes away, so the focus moves to "All"
    allChip.current?.focus();
  };

  return (
    <>
      <fieldset className="mt-8">
        <legend className={label}>Good for</legend>
        <div className="ui-chip-row mt-2">
          {(["All", ...filters] as const).map((option) => (
            <FilterChip
              key={option}
              ref={option === "All" ? allChip : undefined}
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

      <fieldset className="mt-4">
        <legend className={label}>Also</legend>
        <div className="ui-chip-row mt-2">
          {alsoOptions.map((option) => (
            <FilterChip
              key={option}
              name="also"
              value={option}
              checked={also.includes(option)}
              onChange={() => toggleAlso(option)}
            >
              {option}
            </FilterChip>
          ))}
        </div>
      </fieldset>

      {/* read out by screen readers each time a filter changes */}
      <p role="status" className={`${label} mt-6`}>
        {filtered
          ? `${matching.length} of ${spots.length} spots`
          : `${spots.length} spots`}
      </p>

      {matching.length === 0 ? (
        <div className="mt-4">
          <StateMessage kind="empty" title="No spots match these filters">
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </StateMessage>
        </div>
      ) : (
        <ul
          role="list"
          className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {matching.map((item) => (
            // "grid" stretches each card to the height of its row
            <li key={item.id} className="grid">
              <SpotCard
                name={item.name}
                type={item.type}
                headingLevel={2}
                picture={
                  <SpotPicture
                    spot={item}
                    place="card"
                    sizes="(min-width: 80rem) 23rem, (min-width: 48rem) 45vw, 100vw"
                  />
                }
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
      )}

      <DetailPanel
        open={open}
        onClose={() => setOpen(false)}
        title={spot.name}
        type={spot.type}
      >
        <Picture>
          <SpotPicture
            spot={spot}
            place="panel"
            sizes="(max-width: 40rem) 100vw, 26rem"
          />
        </Picture>
        {spot.also.length > 0 && (
          <ul role="list" className="flex flex-wrap gap-2">
            {spot.also.map((option) => (
              <li key={option}>
                <Badge>{alsoBadge[option]}</Badge>
              </li>
            ))}
          </ul>
        )}
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
