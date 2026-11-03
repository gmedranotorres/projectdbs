import { Show } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LiveBoard } from "@/components/live-board";
import { Loading } from "@/components/ui";
import { Welcome } from "./welcome";

export const metadata: Metadata = { title: { absolute: "Estaciones" } };

// Signed out, "/" is the welcome page. Signed in, it's the live page, which the
// browser draws: it holds the Realtime connection.
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Show when="signed-in" fallback={<Welcome />}>
        <LiveBoard />
      </Show>
    </Suspense>
  );
}
