import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { EditApplication } from "./edit-application";

export const metadata: Metadata = { title: "Update" };

export default function EditPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditApplication />
    </Suspense>
  );
}
