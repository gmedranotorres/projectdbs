import type { Metadata } from "next";
import { PageHeader, TextLink } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

// Any address Seguimiento doesn't have: the same header as every page, and
// the way back.
export default function NotFound() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Page not found"
        description="There's no page at this address."
        back={{ href: "/", label: "Home" }}
      />
      <p>
        <TextLink href="/applications">See all applications</TextLink>
      </p>
    </div>
  );
}
