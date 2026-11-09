"use client";

import { useEffect, useRef, useState } from "react";
import type { Block, Course, Plan, PlanResult } from "@/lib/plan";

const COURSE: Record<Course, { name: string; bar: string; text: string }> = {
  dbs: { name: "DBS", bar: "bg-dbs", text: "text-dbs" },
  micro: { name: "Micro", bar: "bg-micro", text: "text-micro" },
  clinic: { name: "Clinic", bar: "bg-clinic", text: "text-clinic" },
};

const mins = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3);
const clock = (t: string) => {
  const h = +t.slice(0, 2), m = t.slice(3);
  return `${((h + 11) % 12) + 1}:${m}${h < 12 ? " am" : " pm"}`;
};
const chicagoNow = () => {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => p.find((x) => x.type === t)!.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, minutes: +get("hour") * 60 + +get("minute") };
};

export default function Today() {
  const [result, setResult] = useState<PlanResult | null>(null);
  const [changed, setChanged] = useState(0);
  const [now, setNow] = useState(chicagoNow);
  const lastSeen = useRef<string | null>(null);

  // Poll the newest plan every 2 seconds; the page changes as soon as a new plan is saved.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r: PlanResult = await (await fetch("/api/plan", { cache: "no-store" })).json();
        if (!alive) return;
        const key = r.status === "ok" ? `${r.file}@${r.modified}` : r.status;
        if (lastSeen.current !== null && key !== lastSeen.current) setChanged((c) => c + 1);
        lastSeen.current = key;
        setResult(r);
      } catch {
        /* the dev server restarted; try again on the next tick */
      }
    };
    load();
    const poll = setInterval(load, 2000);
    const tick = setInterval(() => setNow(chicagoNow()), 30000);
    return () => { alive = false; clearInterval(poll); clearInterval(tick); };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-12">
      {result === null && <p className="text-muted">Loading your day…</p>}
      {result?.status === "empty" && <Empty />}
      {result?.status === "error" && (
        <div role="alert" className="rounded-lg border border-accent bg-surface p-5">
          <p className="font-semibold">The newest plan ({result.file}) can&apos;t be read.</p>
          <p className="mt-1 text-muted">{result.message}. Ask Claude to save it again.</p>
        </div>
      )}
      {result?.status === "ok" && <Day key={changed} plan={result.plan} now={now} fresh={changed > 0} />}
    </main>
  );
}

function Empty() {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center">
      <h1 className="font-display text-3xl">No plan yet</h1>
      <p className="mt-2 text-muted">Say good morning to Claude. Your day appears here once you agree on a plan.</p>
    </div>
  );
}

function Day({ plan, now, fresh }: { plan: Plan; now: { date: string; minutes: number }; fresh: boolean }) {
  const isToday = plan.date === now.date;
  const dateLabel = new Date(`${plan.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const savedLabel = new Date(plan.saved_at).toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" });

  return (
    <div className={fresh ? "flash rounded-xl" : undefined}>
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{isToday ? "Today" : "Latest plan"}</p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{dateLabel}</h1>
        </div>
        {plan.check_in && (
          <p className="text-sm text-muted">
            {plan.check_in.woke_at && <>Up at {clock(plan.check_in.woke_at)}</>}
            {plan.check_in.wake_target && <> · target {clock(plan.check_in.wake_target)}</>}
          </p>
        )}
      </header>
      {!isToday && (
        <p className="mt-3 rounded-md bg-accent-soft px-3 py-2 text-sm">This is the plan from {dateLabel}. Check in with Claude for today&apos;s.</p>
      )}

      {plan.headline && <p className="mt-5 text-lg leading-snug">{plan.headline}</p>}

      {plan.weather && (
        <section aria-label="Weather and commute" className="mt-5 flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3">
          <span aria-hidden className="text-2xl">{plan.weather.commute === "bike" ? "🚲" : "🚶"}</span>
          <div>
            <p className="font-semibold">{plan.weather.commute === "bike" ? "Bike day" : "Walk today"}</p>
            <p className="text-sm text-muted">{plan.weather.summary}{plan.weather.why && ` ${plan.weather.why}.`}</p>
          </div>
        </section>
      )}

      <section aria-label="Schedule" className="mt-8">
        <ol className="relative space-y-2">
          {plan.blocks.map((b, i) => (
            <BlockRow key={i} block={b} state={!isToday ? "future" : now.minutes >= mins(b.end) ? "past" : now.minutes >= mins(b.start) ? "now" : "future"} />
          ))}
        </ol>
      </section>

      {!!plan.carried_over?.length && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold tracking-widest text-muted uppercase">Carried over</h2>
          <ul className="mt-2 space-y-1.5">
            {plan.carried_over.map((c, i) => (
              <li key={i} className="rounded-md border border-dashed border-line px-3 py-2">{c}</li>
            ))}
          </ul>
        </section>
      )}

      {!!plan.deadlines?.length && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold tracking-widest text-muted uppercase">Coming up</h2>
          <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-surface">
            {plan.deadlines.map((d, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <span>
                  {d.course && <span className={`mr-2 text-xs font-bold uppercase ${COURSE[d.course].text}`}>{COURSE[d.course].name}</span>}
                  {d.what}
                </span>
                <span className="shrink-0 text-sm text-muted tabular-nums">
                  {dueLabel(d.due)}
                  {d.estimated && <span className="ml-1 italic">(estimate)</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!plan.notes?.length && (
        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-muted">
          {plan.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}

      <p className="mt-10 text-xs text-muted" aria-live="polite">
        Plan saved {savedLabel}{fresh && " · just updated"} · refreshes on its own
      </p>
    </div>
  );
}

function BlockRow({ block: b, state }: { block: Block; state: "past" | "now" | "future" }) {
  const course = b.course ? COURSE[b.course] : null;
  const quiet = b.kind === "travel" || b.kind === "buffer" || b.kind === "break";
  const fixed = b.kind === "class" || b.kind === "meal";
  return (
    <li
      aria-current={state === "now" ? "time" : undefined}
      className={[
        "flex gap-4 rounded-lg px-4",
        quiet ? "py-1.5" : "py-3",
        state === "now" ? "bg-surface ring-2 ring-accent" : quiet ? "" : "border border-line bg-surface",
        state === "past" ? "opacity-50" : "",
      ].join(" ")}
    >
      <div className="w-20 shrink-0 pt-0.5 text-sm text-muted tabular-nums">
        {clock(b.start)}
        {!quiet && <span className="block text-xs">to {clock(b.end)}</span>}
      </div>
      {!quiet && <div aria-hidden className={`w-1 shrink-0 rounded-full ${course ? course.bar : "bg-line"}`} />}
      <div className="min-w-0">
        <p className={quiet ? "text-sm text-muted" : "font-semibold"}>
          {state === "now" && <span className="mr-2 rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-surface uppercase">Now</span>}
          {course && !quiet && <span className={`mr-2 text-xs font-bold uppercase ${course.text}`}>{course.name}</span>}
          {b.title}
          {fixed && b.place && <span className="font-normal text-muted"> · {b.place}</span>}
        </p>
        {b.outcome && <p className="mt-0.5 text-sm text-muted">Done when: {b.outcome}</p>}
        {!fixed && b.place && <p className="mt-0.5 text-sm text-muted">{b.place}</p>}
      </div>
    </li>
  );
}

function dueLabel(due: string) {
  const hasTime = due.includes("T");
  const d = new Date(hasTime ? due : `${due}T12:00:00`);
  const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return hasTime ? `${day}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}` : day;
}
