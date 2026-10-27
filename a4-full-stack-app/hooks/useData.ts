"use client";

import { useSession } from "@clerk/nextjs";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS } from "@/lib/records";
import { useSupabase } from "@/lib/supabase/client";
import type { Tables, TablesInsert } from "@/lib/supabase/database.types";
import type { Application, Settings, Sponsorship, Status } from "@/lib/types";

// The signed-in person's applications and settings, for any client
// component. They live in Supabase, read and written with the Clerk session
// token; row-level security keeps each person to their own rows. user_id is
// never sent: the database fills it in from the token.
//
// Everything is read once per sign-in. Until then `hydrated` is false and
// pages show the neutral <Loading /> skeleton, never the empty state, so
// someone with data never sees the first-visit page flash. If the read
// fails, `loadFailed` is true and the banner offers to try again.
//
// Every component shares one copy, so a change in one (say, the form) shows
// in all the others at once. A change is shown only once the database has
// saved it, so the screen never shows something that isn't saved. Each one
// resolves to null or false when the save failed; nothing changes then, so
// a form can keep what was typed.

type Client = ReturnType<typeof useSupabase>;

// Everything but user_id.
const APP_COLUMNS =
  "id, company, role, job_url, source, muse_job_id, sponsorship, status, applied_on, interview_on, next_follow_up, contact, notes, last_touched_on, created_at, updated_at";
const SETTINGS_COLUMNS = "weekly_goal, goal_chosen, last_check_in_on, check_in_day, dismissed_hints";

type AppRow = Omit<Tables<"applications">, "user_id">;
type SettingsRow = Omit<Tables<"user_settings">, "user_id" | "updated_at">;

// ---- Rows and records ---------------------------------------------------

// The database's check constraints only allow the app's own statuses and
// sponsorship values, so they're taken as they come.
function fromRow(r: AppRow): Application {
  return {
    id: r.id,
    company: r.company,
    role: r.role,
    status: r.status as Status,
    sponsorship: r.sponsorship as Sponsorship,
    source: r.source === "muse" ? "muse" : "manual",
    museJobId: r.muse_job_id,
    appliedOn: r.applied_on,
    interviewOn: r.interview_on,
    followUpOn: r.next_follow_up,
    contact: r.contact,
    link: r.job_url,
    notes: r.notes,
    lastTouchedOn: r.last_touched_on,
    // One format for every time ("…Z"), so they compare as text, as
    // combine() and the sort by updatedAt do.
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

// What the form decides. A new application's id and times come from the
// database.
function toRow(app: Application) {
  return {
    company: app.company,
    role: app.role,
    job_url: app.link,
    source: app.source,
    muse_job_id: app.museJobId,
    sponsorship: app.sponsorship,
    status: app.status,
    applied_on: app.appliedOn,
    interview_on: app.interviewOn,
    next_follow_up: app.followUpOn,
    contact: app.contact,
    notes: app.notes,
    last_touched_on: app.lastTouchedOn,
  } satisfies TablesInsert<"applications">;
}

// A record from a backup file keeps its own id and times, so combining the
// same file twice changes nothing.
function toFullRow(app: Application): TablesInsert<"applications"> {
  return { ...toRow(app), id: app.id, created_at: app.createdAt, updated_at: app.updatedAt };
}

function settingsFromRow(r: SettingsRow): Settings {
  return {
    weeklyGoal: r.weekly_goal,
    ...(r.goal_chosen ? { goalChosen: true as const } : {}),
    ...(r.last_check_in_on ? { lastCheckInOn: r.last_check_in_on } : {}),
    checkInDay: r.check_in_day,
    dismissedHints: r.dismissed_hints,
  };
}

// Only the settings in `change` are written; the rest keep their saved
// values (or the database's defaults, the first time).
function settingsToRow(change: Partial<Settings>): TablesInsert<"user_settings"> {
  const row: TablesInsert<"user_settings"> = { updated_at: new Date().toISOString() };
  if (change.weeklyGoal !== undefined) row.weekly_goal = change.weeklyGoal;
  if ("goalChosen" in change) row.goal_chosen = change.goalChosen === true;
  if ("lastCheckInOn" in change) row.last_check_in_on = change.lastCheckInOn ?? null;
  if ("checkInDay" in change) row.check_in_day = change.checkInDay ?? 1;
  if (change.dismissedHints !== undefined) row.dismissed_hints = change.dismissedHints;
  return row;
}

// The same id twice in one file would fail the whole save; the last wins.
function uniqueById(apps: Application[]): Application[] {
  return [...new Map(apps.map((a) => [a.id, a])).values()];
}

// ---- The shared copy ----------------------------------------------------

type Data = { applications: Application[]; settings: Settings };

type State =
  | { userId: string; status: "loading" | "failed" }
  | ({ userId: string; status: "ready" } & Data);

let state: State | null = null;
const listeners = new Set<() => void>();

function commit(next: State | null) {
  state = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function ready() {
  return state?.status === "ready" ? state : null;
}

function change(next: Partial<Data>) {
  const now = ready();
  if (now) commit({ ...now, ...next });
}

async function fetchAll(client: Client): Promise<Data | null> {
  const [apps, settings] = await Promise.all([
    client.from("applications").select(APP_COLUMNS),
    // No row until the person first changes a setting.
    client.from("user_settings").select(SETTINGS_COLUMNS).maybeSingle(),
  ]);
  if (apps.error || settings.error) return null;
  return {
    applications: apps.data.map(fromRow),
    settings: settings.data ? settingsFromRow(settings.data) : DEFAULT_SETTINGS,
  };
}

async function load(client: Client, userId: string) {
  commit({ userId, status: "loading" });
  const data = await fetchAll(client);
  // Signed out, or someone else signed in, while it was loading.
  if (state?.userId !== userId) return;
  commit(data ? { userId, status: "ready", ...data } : { userId, status: "failed" });
}

// After a change to many rows at once (a backup), read everything back.
async function reload(client: Client) {
  const userId = state?.userId;
  if (!userId) return;
  const data = await fetchAll(client);
  if (data && state?.userId === userId) commit({ userId, status: "ready", ...data });
}

// ---- Changes ------------------------------------------------------------

function actions(client: Client) {
  async function setSettings(next: Partial<Settings>): Promise<boolean> {
    const { data, error } = await client
      .from("user_settings")
      .upsert(settingsToRow(next), { onConflict: "user_id" })
      .select(SETTINGS_COLUMNS)
      .single();
    if (error) return false;
    change({ settings: settingsFromRow(data) });
    return true;
  }

  return {
    // Adds a new application. Resolves to it as saved, with the id the
    // database gave it, or null.
    async add(app: Application): Promise<Application | null> {
      const { data, error } = await client
        .from("applications")
        .insert(toRow(app))
        .select(APP_COLUMNS)
        .single();
      // A job from Find jobs already saved, on another device: read it back
      // and treat it as saved.
      if (error?.code === "23505" && app.museJobId !== null) {
        await reload(client);
        return ready()?.applications.find((a) => a.museJobId === app.museJobId) ?? null;
      }
      if (error) return null;
      const saved = fromRow(data);
      change({ applications: [...(ready()?.applications ?? []), saved] });
      return saved;
    },

    // Saves changes to the application with the same id. Null as well when
    // it's no longer there (deleted on another device).
    async update(app: Application): Promise<Application | null> {
      const { data, error } = await client
        .from("applications")
        .update({ ...toRow(app), updated_at: app.updatedAt })
        .eq("id", app.id)
        .select(APP_COLUMNS)
        .single();
      if (error) return null;
      const saved = fromRow(data);
      change({ applications: (ready()?.applications ?? []).map((a) => (a.id === saved.id ? saved : a)) });
      return saved;
    },

    async remove(id: string): Promise<boolean> {
      const { error } = await client.from("applications").delete().eq("id", id);
      if (error) return false;
      change({ applications: (ready()?.applications ?? []).filter((a) => a.id !== id) });
      return true;
    },

    // Combines a backup on Move data: what's new is added, and a matching id
    // takes the backup's copy only if it changed more recently. Nothing is
    // deleted. Either all of it is saved or none of it.
    async combine(incoming: Application[]): Promise<boolean> {
      const mine = new Map((ready()?.applications ?? []).map((a) => [a.id, a]));
      const rows = uniqueById(incoming)
        .filter((app) => {
          const saved = mine.get(app.id);
          return !saved || app.updatedAt > saved.updatedAt;
        })
        .map(toFullRow);
      if (rows.length > 0) {
        const { error } = await client.from("applications").upsert(rows);
        if (error) return false;
      }
      await reload(client);
      return true;
    },

    // Replaces everything, for Import on the check-in. The file's
    // applications are saved first, so if that fails nothing has changed;
    // then the ones not in the file are deleted. Without settings in the
    // file (an older backup), the saved settings stay.
    async replaceAll(applications: Application[], settings: Settings | null): Promise<boolean> {
      const incoming = uniqueById(applications);
      if (incoming.length > 0) {
        const { error } = await client.from("applications").upsert(incoming.map(toFullRow));
        if (error) return false;
      }
      const keep = new Set(incoming.map((a) => a.id));
      const gone = (ready()?.applications ?? []).filter((a) => !keep.has(a.id)).map((a) => a.id);
      let ok = true;
      if (gone.length > 0) {
        const { error } = await client.from("applications").delete().in("id", gone);
        if (error) ok = false;
      }
      if (ok && settings) {
        ok = await setSettings({
          ...settings,
          // Spelled out, so settings missing from the file are cleared too.
          goalChosen: settings.goalChosen,
          lastCheckInOn: settings.lastCheckInOn,
          checkInDay: settings.checkInDay,
        });
      }
      await reload(client);
      return ok;
    },

    setSettings,

    // Records a closed hint so it stays closed, on every page and device.
    async dismissHint(id: string): Promise<boolean> {
      const hints = ready()?.settings.dismissedHints ?? [];
      if (hints.includes(id)) return true;
      return setSettings({ dismissedHints: [...hints, id] });
    },
  };
}

// ---- The hook -----------------------------------------------------------

const NONE: Application[] = [];

export function useData() {
  const { isLoaded, session } = useSession();
  const userId = session?.user.id ?? null;
  const client = useSupabase();
  // Null on the server and until the first read.
  const current = useSyncExternalStore(
    subscribe,
    () => state,
    () => null,
  );

  useEffect(() => {
    if (!isLoaded) return;
    // Signed out: forget the last person's data.
    if (!userId) {
      if (state) commit(null);
      return;
    }
    if (state?.userId !== userId) void load(client, userId);
  }, [isLoaded, userId, client]);

  const act = useMemo(() => actions(client), [client]);
  const mine = current && current.userId === userId ? current : null;
  const loaded = mine?.status === "ready" ? mine : null;

  return {
    hydrated: loaded !== null,
    loadFailed: mine?.status === "failed",
    retry: () => {
      if (userId) void load(client, userId);
    },
    applications: loaded?.applications ?? NONE,
    settings: loaded?.settings ?? DEFAULT_SETTINGS,
    ...act,
  };
}
