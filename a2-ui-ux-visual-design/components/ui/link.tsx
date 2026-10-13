import Link from "next/link";
import type { ComponentProps } from "react";
import "./ui.css";

// A link in running text or on its own line.
export function InlineLink({
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return <Link className={`ui-link ${className}`} {...props} />;
}
