import { useSyncExternalStore } from "react";
import { readApplication, type Application } from "./applications";

// Everything lives in this browser's localStorage under one key. The server
// never sees it, so on the server (and while the page hydrates) the hook
// returns null: "not loaded yet". That keeps the empty state from flashing
// for someone who has data.

const KEY = "seguimiento:v1";

export type StoreState = {
  applications: Application[];
  // "unavailable" when the browser won't save (a private window, blocked
  // site data). Changes then live only in this tab.
  saving: "ok" | "unavailable";
  // Saved data couldn't be read, so it was set aside under another key.
  recovered: boolean;
};

let state: StoreState | null = null;
const listeners = new Set<() => void>();

function storageWorks(): boolean {
  try {
    localStorage.setItem(`${KEY}:test`, "1");
    localStorage.removeItem(`${KEY}:test`);
    return true;
  } catch {
    return false;
  }
}

// The records in the saved text, and whether any of it was unreadable.
function readSaved(raw: string): { applications: Application[]; damaged: boolean } {
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data?.applications)) {
      return { applications: [], damaged: true };
    }
    const apps = data.applications.map(readApplication);
    const good = apps.filter((a: Application | null) => a !== null);
    return { applications: good, damaged: good.length < apps.length };
  } catch {
    return { applications: [], damaged: true };
  }
}

function load(): StoreState {
  if (!storageWorks()) {
    return { applications: [], saving: "unavailable", recovered: false };
  }
  const raw = localStorage.getItem(KEY);
  if (raw === null) {
    return { applications: [], saving: "ok", recovered: false };
  }
  const { applications, damaged } = readSaved(raw);
  if (damaged) {
    // Keep the original text so nothing is lost for good, then carry on
    // with whatever could be read.
    try {
      localStorage.setItem(`${KEY}:unreadable:${Date.now()}`, raw);
      localStorage.setItem(KEY, JSON.stringify({ version: 1, applications }));
    } catch {
      // Storage is full; leave the original where it is.
    }
  }
  return { applications, saving: "ok", recovered: damaged };
}

function getSnapshot(): StoreState {
  if (!state) state = load();
  return state;
}

function getServerSnapshot(): null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  for (const listener of listeners) listener();
}

// Returns false when the browser refused to save (usually storage is full);
// nothing changes then, so the form can keep what was typed.
function write(applications: Application[]): boolean {
  const current = getSnapshot();
  if (current.saving === "ok") {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: 1, applications }));
    } catch {
      return false;
    }
  }
  state = { ...current, applications };
  emit();
  return true;
}

export function useStore(): StoreState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Adds the application, or replaces the one with the same id.
export function saveApplication(app: Application): boolean {
  const apps = getSnapshot().applications;
  const exists = apps.some((a) => a.id === app.id);
  return write(exists ? apps.map((a) => (a.id === app.id ? app : a)) : [...apps, app]);
}

export function deleteApplication(id: string): boolean {
  return write(getSnapshot().applications.filter((a) => a.id !== id));
}

export function replaceApplications(applications: Application[]): boolean {
  return write(applications);
}

export function dismissRecovered() {
  state = { ...getSnapshot(), recovered: false };
  emit();
}
