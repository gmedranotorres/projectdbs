import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { ThisWeek } from "./this-week";

// Saved applications live only in the browser, so the page is drawn there;
// the server sends the loading placeholder.
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ThisWeek />
    </Suspense>
  );
}
