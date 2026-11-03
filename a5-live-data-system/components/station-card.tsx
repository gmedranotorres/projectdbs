import { CHANGE_SHOWS_FOR_MS, type RecentChange } from "@/hooks/useLiveData";
import { classicBikes, formatAge } from "@/lib/freshness";
import type { Station } from "@/lib/supabase/database.types";
import { Badge, Button, Card } from "./ui";

function Count({ label, value, delta, dimmed }: { label: string; value: number; delta: number; dimmed: boolean }) {
  return (
    <div>
      <dt className="text-label text-muted">{label}</dt>
      <dd className={`mt-0.5 flex items-baseline gap-1.5 font-serif text-[2rem] leading-none tabular-nums ${dimmed ? "text-muted" : ""}`}>
        {value}
        {delta !== 0 && (
          // The words say which way it moved, so color isn't the only sign.
          <span className="rounded-badge bg-surface px-1 font-sans text-label font-semibold text-ink">
            <span className="sr-only">changed by </span>
            {delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`}
          </span>
        )}
      </dd>
    </div>
  );
}

export function StationCard({
  station,
  change,
  now,
  dimmed,
  busy,
  onUnfollow,
}: {
  station: Station;
  change?: RecentChange;
  now: number;
  dimmed: boolean;
  busy: boolean;
  onUnfollow: () => void;
}) {
  const recent = change && now - change.at < CHANGE_SHOWS_FOR_MS ? change : null;
  const closed = !station.is_installed || !station.is_renting;

  return (
    <Card
      data-testid="station"
      tone={recent ? "highlight" : "default"}
      className="transition-colors duration-1000 motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-medium wrap-anywhere">{station.name}</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            {closed && <Badge tone="closed">Closed</Badge>}
            {!closed && !station.is_returning && <Badge tone="warning">Not taking returns</Badge>}
            <span>
              {recent ? "Just changed" : `Last changed ${formatAge(now - Date.parse(station.changed_at))}`}
            </span>
          </p>
        </div>
        <Button variant="quiet" size="sm" disabled={busy} onClick={onUnfollow}>
          Unfollow<span className="sr-only"> {station.name}</span>
        </Button>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-3">
        <Count label="Classic bikes" value={classicBikes(station)} delta={recent?.classic ?? 0} dimmed={dimmed} />
        <Count label="E-bikes" value={station.ebikes} delta={recent?.ebikes ?? 0} dimmed={dimmed} />
        <Count label="Open docks" value={station.docks} delta={recent?.docks ?? 0} dimmed={dimmed} />
      </dl>
    </Card>
  );
}
