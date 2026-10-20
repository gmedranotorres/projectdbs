import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { AddApplication } from "./add-application";

export const metadata: Metadata = { title: "Add" };

export default function AddPage() {
  // Suspense: Back reads ?from= from the address, known only in the browser.
  return (
    <Suspense fallback={<Loading />}>
      <AddApplication />
    </Suspense>
  );
}
