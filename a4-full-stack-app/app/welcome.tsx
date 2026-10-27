import { ButtonLink, PageHeader } from "@/components/ui";

// What a signed-out visitor sees at "/": what Seguimiento is, and the way in.
export function Welcome() {
  return (
    <div>
      <PageHeader
        title="Seguimiento"
        description="A job-application tracker built around follow-ups, with a weekly check-in."
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/sign-up">Sign up</ButtonLink>
        <ButtonLink href="/sign-in" variant="secondary">
          Sign in
        </ButtonLink>
      </div>
    </div>
  );
}
