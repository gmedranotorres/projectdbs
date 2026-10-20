import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { ThisWeek } from "../this-week";

export const metadata: Metadata = { title: "This week" };

// The weekly check-in, on any day. Home's numbers and every page's footer
// link here.
export default function CheckInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ThisWeek />
    </Suspense>
  );
}
