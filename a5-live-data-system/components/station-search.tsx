"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useId, useState } from "react";
import { Bike } from "@/components/bikes";
import { MAX_FOLLOWS } from "@/hooks/useLiveData";
import { classicBikes } from "@/lib/freshness";
import type { Database, Station } from "@/lib/supabase/database.types";
import { Button, Field, Input } from "./ui";

// Real station names near the University of Chicago, as a place to start.
const NEAR_CAMPUS = [
  "University Ave & 57th St",
  "Ellis Ave & 58th St",
  "Blackstone Ave & 59th St",
  "Woodlawn Ave & 55th St",
];

type Found = Pick<Station, "station_id" | "name" | "bikes" | "ebikes" | "docks">;
const COLUMNS = "station_id,name,bikes,ebikes,docks";

// % and _ mean something to ILIKE, so a search for them finds them literally.
const escapeLike = (text: string) => text.replace(/[\\%_]/g, "\\$&");

export function StationSearch({
  supabase,
  followedIds,
  busyId,
  followError,
  onFollow,
}: {
  supabase: SupabaseClient<Database>;
  followedIds: Set<string>;
  busyId: string | null;
  followError: string | null;
  onFollow: (station: Found) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Found[] | null>(null);
  const [suggestions, setSuggestions] = useState<Found[]>([]);
  const [searchFailed, setSearchFailed] = useState(false);
  const listId = useId();
  const full = followedIds.size >= MAX_FOLLOWS;
  const term = query.trim();

  useEffect(() => {
    let current = true;
    void supabase
      .from("divvy_stations")
      .select(COLUMNS)
      .in("name", NEAR_CAMPUS)
      .order("name")
      .then(({ data }) => {
        if (current && data) setSuggestions(data);
      });
    return () => {
      current = false;
    };
  }, [supabase]);

  // Waits for a pause in typing, and ignores an answer that's out of date.
  useEffect(() => {
    if (term.length < 2) return;
    let current = true;
    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from("divvy_stations")
        .select(COLUMNS)
        .ilike("name", `%${escapeLike(term)}%`)
        .order("name")
        .limit(8);
      if (!current) return;
      setSearchFailed(Boolean(error));
      setResults(data ?? []);
    }, 250);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [supabase, term]);

  const searching = term.length >= 2;
  const shown = searching ? results : suggestions;

  return (
    <section aria-labelledby={`${listId}-title`}>
      <h2 id={`${listId}-title`} className="font-display text-heading">
        Add a station
      </h2>
      <div className="mt-3">
        <Field
          label="Find a station"
          hint={full ? `You're following the most we can show, ${MAX_FOLLOWS}. Unfollow one to add another.` : "Type part of a street name, like Ellis or 57th."}
          error={followError ?? undefined}
        >
          <Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
        </Field>
      </div>

      <p aria-live="polite" className="mt-3 text-sm text-muted">
        {searching
          ? searchFailed
            ? "The search didn't work. Check your connection and try again."
            : results === null
              ? "Searching…"
              : results.length === 0
                ? `No stations match "${term}". Try one street name.`
                : `${results.length === 8 ? "First 8 matches" : `${results.length} ${results.length === 1 ? "match" : "matches"}`}`
          : "Near the University of Chicago"}
      </p>

      {shown && shown.length > 0 && (
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-raised">
          {shown.map((station) => {
            const following = followedIds.has(station.station_id);
            return (
              <li key={station.station_id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <Bike type="classic" className="hidden h-6 w-10 shrink-0 text-classic sm:block" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium wrap-anywhere">{station.name}</p>
                  <p className="text-sm text-muted tabular-nums">
                    {classicBikes(station)} classic · {station.ebikes} {station.ebikes === 1 ? "e-bike" : "e-bikes"} ·{" "}
                    {station.docks} {station.docks === 1 ? "dock" : "docks"}
                  </p>
                </div>
                <Button
                  variant={following ? "quiet" : "secondary"}
                  size="sm"
                  disabled={following || full || busyId !== null}
                  onClick={() => onFollow(station)}
                >
                  {following ? "Following" : busyId === station.station_id ? "Adding…" : "Follow"}
                  <span className="sr-only"> {station.name}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
