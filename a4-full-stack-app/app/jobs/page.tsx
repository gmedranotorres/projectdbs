import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { FindJobs } from "./find-jobs";

export const metadata: Metadata = { title: "Find jobs" };

export default function JobsPage() {
  // Suspense: the filters and Back read the address, known only in the browser.
  return (
    <Suspense fallback={<Loading label="Loading jobs…" />}>
      <FindJobs />
    </Suspense>
  );
}
