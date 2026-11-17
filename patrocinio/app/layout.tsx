import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patrocinio",
  description: "Which Chicago employers file visas for data roles, and which of them are hiring now.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
