import type { Metadata } from "next";
import { MoveData } from "./move-data";

export const metadata: Metadata = { title: "Move data" };

export default function MovePage() {
  return <MoveData />;
}
