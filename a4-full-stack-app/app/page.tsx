import { Show } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { HomePage } from "./home-page";
import { Welcome } from "./welcome";

// The root layout's "%s · Seguimiento" template only reaches pages in
// folders below it, so this one is spelled out.
export const metadata: Metadata = { title: { absolute: "Home · Seguimiento" } };

// Signed out, "/" is the welcome page, the only one there is. Signed in,
// it's Home: the browser reads the applications from Supabase, so that page
// is drawn there; the server sends the loading placeholder.
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Show when="signed-in" fallback={<Welcome />}>
        <HomePage />
      </Show>
    </Suspense>
  );
}
