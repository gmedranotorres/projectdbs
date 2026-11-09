import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export type Course = "dbs" | "micro" | "clinic";
export type Kind = "work" | "class" | "meal" | "travel" | "study" | "buffer" | "break";

export type Block = {
  start: string;
  end: string;
  kind: Kind;
  title: string;
  course?: Course;
  outcome?: string;
  place?: string;
};

export type Plan = {
  date: string;
  saved_at: string;
  check_in?: { at?: string; woke_at?: string; wake_target?: string };
  headline?: string;
  weather?: { summary: string; commute: "walk" | "bike"; why?: string };
  blocks: Block[];
  deadlines?: { what: string; course?: Course; due: string; estimated?: boolean }[];
  carried_over?: string[];
  notes?: string[];
};

export type PlanResult =
  | { status: "ok"; plan: Plan; file: string; modified: number }
  | { status: "empty" }
  | { status: "error"; file: string; message: string };

const PLANS_DIR = path.join(process.cwd(), "plans");
const DATED = /^\d{4}-\d{2}-\d{2}\.json$/;

// The newest plan is the file with the latest date in its name. If it can't be
// read, say so instead of quietly showing an older day.
export async function readNewestPlan(): Promise<PlanResult> {
  let names: string[];
  try {
    names = (await readdir(PLANS_DIR)).filter((n) => DATED.test(n)).sort();
  } catch {
    return { status: "empty" };
  }
  const name = names.at(-1);
  if (!name) return { status: "empty" };
  const file = path.join(PLANS_DIR, name);
  try {
    const [text, info] = await Promise.all([readFile(file, "utf8"), stat(file)]);
    const plan = JSON.parse(text) as Plan;
    if (!plan.date || !Array.isArray(plan.blocks)) throw new Error("missing date or blocks");
    return { status: "ok", plan, file: `plans/${name}`, modified: info.mtimeMs };
  } catch (e) {
    return { status: "error", file: `plans/${name}`, message: (e as Error).message };
  }
}
