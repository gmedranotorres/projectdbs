import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { ThisWeek } from "../this-week";

export const metadata: Metadata = { title: "This week" };

// The Monday check-in, on any day: what's due, what's gone quiet, or what
// comes up next. Home shows the same page only while something needs doing.
export default function CheckInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ThisWeek page="check-in" />
    </Suspense>
  );
}
