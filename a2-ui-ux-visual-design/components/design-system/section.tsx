import type { ReactNode } from "react";

// One numbered section of a design system page.
export function Section({
  number,
  id,
  title,
  intro,
  children,
}: {
  number: number;
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="ui-rule-top scroll-mt-6 py-12"
    >
      <h2 id={`${id}-title`} className="ui-heading flex items-baseline gap-3">
        {/* lining figures: some display fonts draw an old-style 1 that
            reads as a capital I */}
        <span className="ui-muted tabular-nums lining-nums">{number}</span>
        {title}
      </h2>
      {intro && <p className="ui-muted mt-2 max-w-2xl">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

// A labeled specimen inside a section.
export function Specimen({
  title,
  note,
  className = "",
  children,
}: {
  title: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h3 className="ui-label ui-muted">{title}</h3>
      {note && <p className="ui-muted mt-1 max-w-2xl text-sm">{note}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}
