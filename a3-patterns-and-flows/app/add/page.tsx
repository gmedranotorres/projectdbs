import type { Metadata } from "next";
import { AddApplication } from "./add-application";

export const metadata: Metadata = { title: "Add" };

export default function AddPage() {
  return <AddApplication />;
}
