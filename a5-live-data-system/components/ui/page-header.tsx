import type { ReactNode } from "react";

// The top of the page: the title and one line on what the page is for.
export function PageHeader({ title, description }: { title: ReactNode; description: string }) {
  return (
    <div className="min-w-0">
      <h1 className="font-display text-display uppercase text-balance wrap-anywhere">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>
    </div>
  );
}
