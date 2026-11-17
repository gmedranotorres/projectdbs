import Ocean from "@/components/Ocean";
import Results from "@/components/Results";
import { buildRows, dataset } from "@/lib/results";

const WAVE = "M0 60 Q150 15 300 60 T600 60 T900 60 T1200 60 T1500 60 T1800 60 T2100 60 T2400 60 V120 H0 Z";

export default function Home() {
  const { rows, stats } = buildRows();

  return (
    <>
      <Ocean />

      <header className="hero">
        <div className="rays" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-3 text-[0.9375rem] text-muted">Data jobs · Chicago, IL</p>
          <h1 className="font-display text-[clamp(2.75rem,2rem+4vw,4.25rem)] leading-[1.05] tracking-[-0.02em]">Patrocinio</h1>
          <p className="mt-5 text-xl leading-snug">
            Find employers that file visas for your kind of job, before you apply.
          </p>
          <p className="mt-3 text-muted">
            Every employer here filed for an H‑1B, H‑1B1 or E‑3 worker for a data role in Chicago. Start with the ones hiring now.
          </p>
        </div>
        <svg className="wave" viewBox="0 0 2400 120" preserveAspectRatio="none" aria-hidden="true"><path d={WAVE} /></svg>
        <svg className="wave two" viewBox="0 0 2400 120" preserveAspectRatio="none" aria-hidden="true"><path d={WAVE} /></svg>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20">
        {/* v1 covers one field and one city. Testers took locked dropdowns for broken
            ones (Nov 17), so this states the scope as text instead. */}
        <section aria-label="What this shows" className="rounded-xl border border-line bg-surface px-5 py-4">
          <p>
            Showing <strong className="text-accent">data jobs</strong> in <strong className="text-accent">Chicago, IL</strong>
            <span className="text-muted"> · the only field and city for now. More are coming.</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Data jobs here means data scientists, data and business intelligence analysts, data engineers, statisticians,
            operations research analysts and data architects.
          </p>
        </section>

        <aside className="callout mt-4 rounded-xl border border-line bg-surface px-5 py-4 text-sm">
          <strong>A filing doesn’t promise they’ll sponsor you.</strong>{" "}
          <span className="text-muted">
            It shows the employer planned to hire someone on a visa for this kind of role. Ask the recruiter, too.
          </span>
        </aside>

        <Results rows={rows} stats={stats} />

        <footer className="mt-12 border-t border-line pt-4 text-[0.9375rem] text-muted">
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
    </>
  );
}
