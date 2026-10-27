import type { Metadata } from "next";
import { ComponentGallery } from "./component-gallery";

// Not in the navigation, and kept out of search engines: it's for checking
// that the shared components look the same everywhere.
export const metadata: Metadata = {
  title: "Components",
  robots: { index: false, follow: false },
};

export default function ComponentsPage() {
  return <ComponentGallery />;
}
