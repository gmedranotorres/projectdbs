import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s · UI/UX & Visual Design",
    default: "UI/UX & Visual Design · Design, Build, Ship · Assignment 2",
  },
  description:
    "Assignment 2 for Design, Build, Ship: three mood boards, three design systems, and Hyde Park Study Spots, a guide that helps UChicago students decide where to study.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
