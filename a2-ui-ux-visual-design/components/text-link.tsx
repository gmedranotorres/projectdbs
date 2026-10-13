import Link from "next/link";
import type { ComponentProps } from "react";

// The link style for the neutral pages (hub and placeholders): underlined at
// rest, inverted on hover or press, outlined on keyboard focus.
export function TextLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      className="-mx-1.5 inline-block rounded-sm px-1.5 py-2 text-lg font-medium underline decoration-2 underline-offset-[6px] hover:bg-black hover:text-white hover:no-underline active:bg-black active:text-white active:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      {...props}
    />
  );
}
