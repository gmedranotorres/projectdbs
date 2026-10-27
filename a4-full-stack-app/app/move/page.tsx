import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { MoveData } from "./move-data";

export const metadata: Metadata = { title: "Move data" };

export default function MovePage() {
  // Suspense: Back reads ?from= from the address, known only in the browser.
  return (
    <Suspense fallback={<Loading />}>
      <MoveData />
    </Suspense>
  );
}
