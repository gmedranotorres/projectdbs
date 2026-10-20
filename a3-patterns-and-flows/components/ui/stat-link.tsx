import Link from "next/link";

// A number that's also a way in: "2 / follow-ups due" opens the check-in.
// The whole tile is the link, and its words (number and label together)
// are what screen readers say. The label is underlined like any link, so
// it doesn't look like a static figure. No alarm colors: a count isn't a
// badge to nag with.
export function StatLink({
  href,
  value,
  label,
}: {
  href: string;
  value: string | number;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group block h-full rounded-card border border-line bg-surface p-4 text-ink transition-colors state-hover:border-muted"
    >
      <span className="block font-serif text-heading tabular-nums">{value}</span>{" "}
      <span className="mt-1 block text-sm font-medium underline decoration-accent-strong underline-offset-4 group-hover:decoration-ink group-hover:decoration-2">
        {label}
      </span>
    </Link>
  );
}
