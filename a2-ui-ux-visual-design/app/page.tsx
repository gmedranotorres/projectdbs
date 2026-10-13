import { TextLink } from "@/components/text-link";

type HubLink = {
  href: string;
  label: string;
  // Read aloud after the label, so screen readers can tell "Calm" (mood
  // board) from "Calm" (design system).
  context?: string;
};

const styles = ["Calm", "Arcade", "Editorial"];

const sections: { title: string; links: HubLink[] }[] = [
  {
    title: "Mood Boards",
    links: styles.map((style) => ({
      href: `/mood-boards/${style.toLowerCase()}`,
      label: style,
      context: "mood board",
    })),
  },
  {
    title: "Design Systems",
    links: styles.map((style) => ({
      href: `/design-systems/${style.toLowerCase()}`,
      label: style,
      context: "design system",
    })),
  },
  {
    title: "My Site",
    links: [{ href: "/study-spots", label: "Open Hyde Park Study Spots" }],
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <header>
        <p className="text-sm font-medium">Design, Build, Ship · Assignment 2</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          UI/UX &amp; Visual Design
        </h1>
      </header>

      <div className="mt-16 divide-y divide-black border-y border-black sm:mt-20">
        {sections.map((section, index) => (
          <section
            key={section.title}
            className="py-10 md:grid md:grid-cols-[16rem_1fr] md:items-baseline md:gap-8 md:py-12"
          >
            <h2 className="flex gap-4 text-xl font-semibold sm:text-2xl">
              <span className="w-6 font-normal tabular-nums">{index + 1}</span>
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-3 flex flex-wrap gap-x-8 pl-10 md:mt-0 md:pl-0"
            >
              {section.links.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>
                    {link.label}
                    {link.context && (
                      <span className="sr-only"> {link.context}</span>
                    )}
                  </TextLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
