"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { rowFromEvent } from "@/lib/freshness";
import type { Station, WorkerRun } from "@/lib/supabase/database.types";
import { useSupabase } from "@/lib/supabase/client";

export const MAX_FOLLOWS = 20;

// While a recent change shows on a card, and how long it stays.
export const CHANGE_SHOWS_FOR_MS = 20_000;
// When no run has arrived for this long, stop trusting Realtime alone and ask.
const CHECK_IN_AFTER_MS = 30_000;

export type Connection = "connecting" | "live" | "lost";
export type RecentChange = { classic: number; ebikes: number; docks: number; at: number };

type RunSummary = Pick<WorkerRun, "ran_at" | "ok" | "source_updated_at">;
const RUN_COLUMNS = "ran_at,ok,source_updated_at";

function describeChange(station: Station): string {
  const classic = station.bikes - station.ebikes;
  return `${station.name}: now ${classic} classic ${classic === 1 ? "bike" : "bikes"}, ${station.ebikes} ${
    station.ebikes === 1 ? "e-bike" : "e-bikes"
  }, ${station.docks} open ${station.docks === 1 ? "dock" : "docks"}.`;
}

// The page's connection to the database. It loads the person's stations and the
// latest run once, then Realtime pushes each change.
export function useLiveData() {
  const supabase = useSupabase();
  const { isSignedIn } = useAuth();
  const [realtimeReady, setRealtimeReady] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [latestRun, setLatestRun] = useState<RunSummary | null>(null);
  const [lastGoodRun, setLastGoodRun] = useState<RunSummary | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [connection, setConnection] = useState<Connection>("connecting");
  const [changes, setChanges] = useState<Record<string, RecentChange>>({});
  const [announcement, setAnnouncement] = useState("");
  const [now, setNow] = useState(0);
  const lastLoad = useRef(0);

  const load = useCallback(async () => {
    lastLoad.current = Date.now();
    const [follows, latest, lastGood] = await Promise.all([
      supabase
        .from("followed_stations")
        .select("created_at, divvy_stations(*)")
        .order("created_at", { ascending: true }),
      supabase.from("worker_runs").select(RUN_COLUMNS).order("ran_at", { ascending: false }).limit(1).maybeSingle(),
      supabase
        .from("worker_runs")
        .select(RUN_COLUMNS)
        .eq("ok", true)
        .order("ran_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (follows.error || latest.error || lastGood.error) {
      setLoadFailed(true);
      setLoaded(true);
      return;
    }
    setStations(follows.data.map((row) => row.divvy_stations));
    setLatestRun(latest.data);
    setLastGoodRun(lastGood.data);
    setLoadFailed(false);
    setLoaded(true);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from the database, an outside system.
    void load();
  }, [load]);

  // Realtime needs Clerk's token before it subscribes. Without one it joins as an
  // anonymous visitor, who can't read these tables, and every event is refused.
  useEffect(() => {
    if (!isSignedIn) return;
    let current = true;
    void supabase.realtime.setAuth().then(() => {
      if (current) setRealtimeReady(true);
    });
    return () => {
      current = false;
    };
  }, [supabase, isSignedIn]);

  // Every run, whether or not it changed anything: the page's heartbeat.
  useEffect(() => {
    if (!realtimeReady) return;
    const channel = supabase
      .channel("worker-runs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "worker_runs" }, (payload) => {
        const run = rowFromEvent<WorkerRun>(payload, "ran_at");
        if (!run) {
          setConnection("lost");
          return;
        }
        setConnection("live");
        setLatestRun((current) => (current && current.ran_at > run.ran_at ? current : run));
        if (run.ok) setLastGoodRun((current) => (current && current.ran_at > run.ran_at ? current : run));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnection("live");
          // Anything that changed while we were connecting.
          void load();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          setConnection("lost");
        }
      });
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, load, realtimeReady]);

  // The changes to the stations this person follows, and only those. The filter
  // is what keeps each page from receiving every station's changes.
  const followedIds = stations.map((s) => s.station_id).sort().join(",");
  useEffect(() => {
    if (!realtimeReady || !followedIds) return;
    const channel = supabase
      .channel(`stations:${followedIds}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "divvy_stations", filter: `station_id=in.(${followedIds})` },
        (payload) => {
          const next = rowFromEvent<Station>(payload, "station_id");
          if (!next) {
            setConnection("lost");
            return;
          }
          const at = Date.now();
          setStations((current) => {
            const previous = current.find((s) => s.station_id === next.station_id);
            if (previous) {
              const change: RecentChange = {
                classic: next.bikes - next.ebikes - (previous.bikes - previous.ebikes),
                ebikes: next.ebikes - previous.ebikes,
                docks: next.docks - previous.docks,
                at,
              };
              setChanges((all) => ({ ...all, [next.station_id]: change }));
              setAnnouncement(describeChange(next));
            }
            return current.map((s) => (s.station_id === next.station_id ? next : s));
          });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, followedIds, realtimeReady]);

  // The clock behind "12 seconds ago". It's also how the page notices silence:
  // when the worker stops, no event ever arrives to say so.
  useEffect(() => {
    const tick = () => {
      const time = Date.now();
      setNow(time);
      setLatestRun((run) => {
        const age = run ? time - Date.parse(run.ran_at) : Infinity;
        if (age > CHECK_IN_AFTER_MS && time - lastLoad.current > CHECK_IN_AFTER_MS) void load();
        return run;
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [load]);

  // A phone or a sleeping laptop can miss events, so catch up on coming back.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  const follow = useCallback(
    async (stationId: string) => {
      // user_id isn't sent: the database fills it in from the Clerk token.
      const { error } = await supabase.from("followed_stations").insert({ station_id: stationId });
      // 23505: already following, perhaps from another tab. That's what was asked for.
      if (error && error.code !== "23505") return false;
      await load();
      return true;
    },
    [supabase, load],
  );

  const unfollow = useCallback(
    async (stationId: string) => {
      const { error } = await supabase.from("followed_stations").delete().eq("station_id", stationId);
      if (error) return false;
      await load();
      return true;
    },
    [supabase, load],
  );

  return { supabase, stations, latestRun, lastGoodRun, loaded, loadFailed, connection, changes, announcement, now, follow, unfollow, reload: load };
}
