import type { Metadata } from "next";
import { Placeholder } from "@/components/placeholder";

const title = "Editorial Design System";

export const metadata: Metadata = { title };

export default function Page() {
  return <Placeholder title={title} />;
}
