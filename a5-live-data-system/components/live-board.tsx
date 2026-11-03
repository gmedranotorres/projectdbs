"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLiveData } from "@/hooks/useLiveData";
import { getFreshness, STATES, type Freshness, type FreshnessState } from "@/lib/freshness";
import { StationCard } from "./station-card";
import { StationSearch } from "./station-search";
import { StatusBar } from "./status-bar";
import { Button, Card, Loading, PageHeader } from "./ui";

// In development only, /?simulate=stale (or down, or loading) shows a state on
// purpose, so each one can be looked at without stopping the real worker.
function simulated(requested: string | null, now: number): Freshness | null {
  if (process.env.NODE_ENV !== "development" || !STATES.includes(requested as FreshnessState)) return null;
  const minutes = (n: number) => n * 60_000;
  switch (requested as FreshnessState) {
    case "loading":
      return { state: "loading" };
    case "fresh":
      return { state: "fresh", checkedAgo: 8000, dataAgo: 41_000 };
    case "stale":
      return { state: "stale", reason: "worker-late", checkedAgo: minutes(3), dataAgo: minutes(4) };
    case "down":
      return { state: "down", failedAt: new Date(now - 5000).toISOString(), dataAgo: minutes(2) };
  }
}

export function LiveBoard() {
  const live = useLiveData();
  const { supabase, stations, latestRun, lastGoodRun, loaded, loadFailed, connection, changes, announcement, now, follow, unfollow, reload } = live;
  const requested = useSearchParams().get("simulate");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [followError, setFollowError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const freshness = simulated(requested, now) ?? getFreshness({ loaded, latestRun, lastGoodRun, now });
  const followedIds = new Set(stations.map((s) => s.station_id));
  const dimmed = freshness.state === "stale" || freshness.state === "down";

  async function handleFollow(station: { station_id: string; name: string }) {
    setBusyId(station.station_id);
    setFollowError(null);
    const worked = await follow(station.station_id);
    setBusyId(null);
    if (worked) setNotice(`Now following ${station.name}.`);
    else setFollowError(`${station.name} wasn't added. Check your connection and try again.`);
  }

  async function handleUnfollow(station: { station_id: string; name: string }) {
    setBusyId(station.station_id);
    const worked = await unfollow(station.station_id);
    setBusyId(null);
    setNotice(worked ? `Stopped following ${station.name}.` : `${station.name} wasn't removed. Try again.`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Your stations" description="Bikes and open docks at the Divvy stations you follow. No need to refresh." />

      <StatusBar freshness={freshness} connection={connection} />

      {/* Announced one at a time, without interrupting a screen reader. */}
      <p aria-live="polite" className="sr-only">
        {notice}
      </p>
      <p aria-live="polite" className="sr-only" data-testid="announcement">
        {announcement}
      </p>

      {loadFailed && (
        <Card role="alert" className="border-error bg-error-soft">
          <p className="font-medium">Your stations didn&apos;t load.</p>
          <p className="mt-1 text-sm">Check your connection, then try again.</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => void reload()}>
            Try again
          </Button>
        </Card>
      )}

      {freshness.state === "loading" ? (
        <Loading label="Loading your stations…" />
      ) : (
        !loadFailed && (
          <>
            {stations.length === 0 ? (
              <Card className="border-dashed border-line-strong">
                <h2 className="font-serif text-heading">You&apos;re not following any stations yet</h2>
                <p className="mt-2 text-muted">
                  Follow the stations you actually use, then keep this page open and watch the bikes come and go.
                </p>
              </Card>
            ) : (
              <section aria-label="Stations you follow" className="space-y-3">
                {stations.map((station) => (
                  <StationCard
                    key={station.station_id}
                    station={station}
                    change={changes[station.station_id]}
                    now={now}
                    dimmed={dimmed}
                    busy={busyId !== null}
                    onUnfollow={() => void handleUnfollow(station)}
                  />
                ))}
              </section>
            )}
            <StationSearch
              supabase={supabase}
              followedIds={followedIds}
              busyId={busyId}
              followError={followError}
              onFollow={(station) => void handleFollow(station)}
            />
          </>
        )
      )}
    </div>
  );
}
