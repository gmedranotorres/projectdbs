// How far along something is, such as applications logged against the
// weekly goal. The numbers sit beside the bar, so it never relies on the
// bar alone; screen readers get "2 of 3" from aria-valuetext. Past the goal
// the bar stays full and the numbers say how far past. The fill is 3.65:1
// against the track, above the 3:1 needed for shapes.
export function Progress({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const share = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.min(value, max)}
        aria-valuetext={`${value} of ${max}`}
        className="h-3 flex-1 overflow-hidden rounded-full bg-subtle"
      >
        <div className="h-full rounded-full bg-accent-strong" style={{ width: `${share * 100}%` }} />
      </div>
      <p aria-hidden="true" className="shrink-0 text-sm font-medium tabular-nums">
        {value} of {max}
      </p>
    </div>
  );
}
