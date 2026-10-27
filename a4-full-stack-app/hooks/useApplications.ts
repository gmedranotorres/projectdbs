"use client";

import { useEffect, useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS, loadStore, saveStore, type Loaded } from "@/lib/storage";
import type { Application, Settings, StoreData } from "@/lib/types";

// The saved applications and settings, for any client component.
//
// localStorage is read only inside useEffect, so the server's HTML and the
// first render in the browser match. Until then `hydrated` is false: pages
// show the neutral <Loading /> skeleton, never the empty state, so someone
// with data never sees the first-visit page flash. Pages opened later in the
// same visit have the data at once.
//
// Every component shares one copy, so a change in one (say, the form) shows
// in all the others (the storage banner) at once. Each change returns false
// when the browser refused to save, usually because storage is full; nothing
// changes then, so a form can keep what was typed.

let loaded: Loaded | null = null;
const listeners = new Set<() => void>();

function commit(next: Loaded) {
  loaded = next;
  for (const listener of listeners) listener();
}

// The one read of localStorage, from the hook's effect.
function hydrate() {
  if (!loaded) commit(loadStore());
}

function current(): Loaded {
  if (!loaded) loaded = loadStore();
  return loaded;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function write(change: (data: StoreData) => StoreData): boolean {
  const now = current();
  const data = change(now.data);
  // When the browser won't save at all, changes live in this tab only.
  if (now.saving === "ok" && !saveStore(data)) return false;
  commit({ ...now, data });
  return true;
}

// Adds a new application. toApplication() in lib/applications.ts gives it
// its id (from crypto.randomUUID) and timestamps.
function add(app: Application): boolean {
  return write((data) => ({ ...data, applications: [...data.applications, app] }));
}

// Replaces the saved application that has the same id.
function update(app: Application): boolean {
  return write((data) => ({
    ...data,
    applications: data.applications.map((a) => (a.id === app.id ? app : a)),
  }));
}

function remove(id: string): boolean {
  return write((data) => ({
    ...data,
    applications: data.applications.filter((a) => a.id !== id),
  }));
}

// Replaces the whole list, for combining a backup on Move data.
function replaceAll(applications: Application[]): boolean {
  return write((data) => ({ ...data, applications }));
}

// Replaces everything, for Import on the check-in. Without settings in the
// file (an older backup), this device's settings stay.
function replaceStore(applications: Application[], settings: Settings | null): boolean {
  return write((data) => ({ ...data, applications, settings: settings ?? data.settings }));
}

function setSettings(change: Partial<Settings>): boolean {
  return write((data) => ({ ...data, settings: { ...data.settings, ...change } }));
}

// Records a closed hint so it stays closed, on every page and visit.
function dismissHint(id: string): boolean {
  if (current().data.settings.dismissedHints.includes(id)) return true;
  return write((data) => ({
    ...data,
    settings: { ...data.settings, dismissedHints: [...data.settings.dismissedHints, id] },
  }));
}

function dismissRecovered() {
  commit({ ...current(), recovered: false });
}

export function useApplications() {
  // Null on the server and while the page hydrates.
  const state = useSyncExternalStore(
    subscribe,
    () => loaded,
    () => null,
  );

  useEffect(hydrate, []);

  return {
    hydrated: state !== null,
    applications: state?.data.applications ?? [],
    settings: state?.data.settings ?? DEFAULT_SETTINGS,
    saving: state?.saving ?? "ok",
    recovered: state?.recovered ?? false,
    add,
    update,
    remove,
    replaceAll,
    replaceStore,
    setSettings,
    dismissHint,
    dismissRecovered,
  };
}
