import { SpinningWheel } from "@/components/bikes";
import { formatAge, type Freshness } from "@/lib/freshness";

const time = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

// How fresh the data is, in words. Each state has its own title and icon, so
// nothing depends on telling the colors apart.
export function StatusBar({ freshness, connectionLost }: { freshness: Freshness; connectionLost: boolean }) {
  const connectionNote = connectionLost
    ? " The live connection dropped, so this page is reconnecting and checking every 30 seconds."
    : "";

  switch (freshness.state) {
    case "loading":
      return (
        <Bar tone="quiet" title="Connecting…">
          Getting the latest numbers.
        </Bar>
      );
    case "fresh":
      return (
        <Bar tone="fresh" title="Live">
          Checked {formatAge(freshness.checkedAgo)}. Divvy published this data {formatAge(freshness.dataAgo)}.
          {connectionNote}
        </Bar>
      );
    case "stale":
      return (
        <Bar tone="stale" title="Out of date">
          {freshness.reason === "no-runs" && "No update has come in yet, so these numbers can't be trusted. "}
          {freshness.reason === "worker-late" &&
            `The last check was ${formatAge(freshness.checkedAgo)}. It should happen every 10 seconds. `}
          {freshness.reason === "source-old" &&
            `Divvy hasn't published new data since ${formatAge(freshness.dataAgo)}. We're still checking. `}
          {freshness.reason !== "no-runs" && "Bikes may have moved since these numbers came in."}
          {connectionNote}
        </Bar>
      );
    case "down":
      return (
        <Bar tone="down" title="Not updating">
          The last check failed at {time(freshness.failedAt)}. These are the last good numbers, from{" "}
          {formatAge(freshness.dataAgo)}. It tries again every 10 seconds.
        </Bar>
      );
  }
}

function Bar({
  tone,
  title,
  children,
}: {
  tone: "quiet" | "fresh" | "stale" | "down";
  title: string;
  children: React.ReactNode;
}) {
  const box = {
    quiet: "border-line bg-surface",
    fresh: "border-accent/40 bg-accent-soft",
    stale: "border-late bg-late-soft",
    down: "border-error bg-error-soft",
  }[tone];

  return (
    <div className={`rounded-card border px-4 py-3 shadow-raised ${box}`} data-testid="status" data-state={tone}>
      <p className="flex items-center gap-2 font-display text-xl leading-tight font-bold tracking-wide uppercase">
        {tone === "quiet" && <SpinningWheel spinning className="size-5 shrink-0 text-muted" />}
        {tone === "fresh" && <SpinningWheel spinning className="size-5 shrink-0 text-accent" />}
        {tone === "stale" && (
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0 text-late" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 6v4.5l3 1.5" strokeLinecap="round" />
          </svg>
        )}
        {tone === "down" && (
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0 text-error" fill="currentColor">
            <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-.9 4.25h1.8v5.5H9.1v-5.5Zm.9 9a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3Z" />
          </svg>
        )}
        {title}
      </p>
      <p className="mt-0.5 text-sm">{children}</p>
    </div>
  );
}
