import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { HomePage } from "./home-page";

// The root layout's "%s · Seguimiento" template only reaches pages in
// folders below it, so this one is spelled out.
export const metadata: Metadata = { title: { absolute: "Home · Seguimiento" } };

// Saved applications live only in the browser, so the page is drawn there;
// the server sends the loading placeholder.
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  );
}
