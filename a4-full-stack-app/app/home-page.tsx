"use client";

import { useApplications } from "@/hooks/useApplications";
import { QuickAddHome } from "@/components/quick-add-home";
import { Loading } from "@/components/ui";

// Home is always the quick add. With something saved, it opens with a
// welcome back and three numbers that lead to the check-in and the list.
export function HomePage() {
  const store = useApplications();
  if (!store.hydrated) return <Loading />;
  return <QuickAddHome applications={store.applications} />;
}
