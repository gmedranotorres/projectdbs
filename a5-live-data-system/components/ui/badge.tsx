import type { ReactNode } from "react";

// Calm's badge. Every badge carries words, so color is never the only sign.
export type BadgeTone = "neutral" | "warning" | "closed";

const tones: Record<BadgeTone, string> = {
  neutral: "border-line bg-subtle text-muted",
  warning: "border-late-soft bg-late-soft text-late",
  closed: "border-dashed border-line-strong bg-transparent text-muted",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-badge border px-2 py-0.5 text-label whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}
