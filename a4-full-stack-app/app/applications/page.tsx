import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { ApplicationList } from "./application-list";

export const metadata: Metadata = { title: "All applications" };

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ApplicationList />
    </Suspense>
  );
}
