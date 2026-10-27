import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { ApplicationDetail } from "./application-detail";

export const metadata: Metadata = { title: "Application" };

// The id is only known in the browser, where the applications are, so the
// page is a shell and the detail reads it with useParams.
export default function ApplicationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ApplicationDetail />
    </Suspense>
  );
}
