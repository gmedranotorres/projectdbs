"use client";

import { useData } from "@/hooks/useData";
import { QuickAddHome } from "@/components/quick-add-home";
import { Loading } from "@/components/ui";

// Home is always the quick add. With something saved, it opens with a
// welcome back and three numbers that lead to the check-in and the list.
export function HomePage() {
  const store = useData();
  if (!store.hydrated) return <Loading />;
  return <QuickAddHome applications={store.applications} />;
}
