import Results from "@/components/Results";
import { buildRows, dataset } from "@/lib/results";

export default function Home() {
  const { rows, stats } = buildRows();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header>
        <p className="font-display text-lg text-accent">Patrocinio</p>
        <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
          Find employers that file visas for your kind of job, before you apply.
        </h1>
        <p className="mt-3 text-muted">
          Every employer here filed for an H‑1B, H‑1B1 or E‑3 worker for a data role in Chicago. Start with the ones hiring now.
        </p>
      </header>

      <section aria-label="Search" className="mt-6 flex flex-wrap gap-3">
        <label className="flex flex-col text-sm">
          <span className="text-muted">Field</span>
          <select disabled className="mt-1 rounded-lg border border-line bg-surface px-3 py-2 text-ink" defaultValue="data">
            <option value="data">Data roles</option>
          </select>
        </label>
        <label className="flex flex-col text-sm">
          <span className="text-muted">City</span>
          <select disabled className="mt-1 rounded-lg border border-line bg-surface px-3 py-2 text-ink" defaultValue="chi">
            <option value="chi">Chicago, IL</option>
          </select>
        </label>
        <p className="self-end pb-2 text-sm text-muted">More fields and cities are coming.</p>
      </section>

      <aside className="mt-6 rounded-xl bg-warn-soft p-4 text-sm text-warn-ink">
        <strong>A filing doesn’t promise they’ll sponsor you.</strong> It shows the employer planned to hire someone on a visa
        for this kind of role. Ask the recruiter, too.
      </aside>

      <Results rows={rows} stats={stats} />

      <footer className="mt-12 border-t border-line pt-6 text-sm text-muted">
        <p>
          Visa filings: {dataset.source}. Only certified filings for data roles with a main worksite in Chicago, IL.
        </p>
        <p className="mt-2">
          Open jobs: each employer’s own job board on Greenhouse, Lever or Ashby, found by guessing the board’s name from the
          employer’s name. Only jobs located in Chicago with a data title are shown. Employers with their own careers site
          (like Google or JPMorgan) don’t show jobs yet.
        </p>
        <p className="mt-2">Not legal advice. Built for international students in MPCS 51238, Autumn 2026.</p>
      </footer>
    </main>
  );
}
