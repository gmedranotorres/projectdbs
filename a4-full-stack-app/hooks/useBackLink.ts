"use client";

import { usePathname, useSearchParams } from "next/navigation";

// Where "← Back" goes. Links that open a page from somewhere else add
// ?from=<that page>, such as a list row: /applications/<id>?from=/applications?status=offer.
// When the page came from one of the places below, Back returns there,
// filter and all. Otherwise (a bookmark, a typed address, the nav) it
// goes to Home.

const PLACES: Record<string, string> = {
  "/": "Home",
  "/check-in": "This week",
  "/applications": "All applications",
  "/add": "Log an application",
};

export type BackLink = { href: string; label: string };

export const HOME: BackLink = { href: "/", label: "Home" };

export function useBackLink(): BackLink {
  const from = useSearchParams().get("from");
  // Only paths inside Seguimiento: "//example.com" would leave the site.
  if (!from || !from.startsWith("/") || from.startsWith("//")) return HOME;
  const label = PLACES[from.split("?")[0]];
  return label ? { href: from, label } : HOME;
}

// The current page as a ?from= value, for links that open another page.
// ?new= is left out: coming back shouldn't pin and highlight again.
export function useFromHere(): string {
  const pathname = usePathname();
  const params = new URLSearchParams(useSearchParams().toString());
  params.delete("new");
  const query = params.toString();
  return encodeURIComponent(query ? `${pathname}?${query}` : pathname);
}
