import { TextLink } from "@/components/text-link";

// Stand-in for a page that isn't designed yet: its title and a way back.
export function Placeholder({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <TextLink href="/">← Hub</TextLink>
      <h1 className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
    </main>
  );
}
