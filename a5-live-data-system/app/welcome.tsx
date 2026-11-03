import { ButtonLink, PageHeader } from "@/components/ui";

// What a signed-out visitor sees at "/": what Estaciones is, and the way in.
export function Welcome() {
  return (
    <div>
      <PageHeader
        title="Estaciones"
        description="Follow the Divvy bike stations you use, and watch bikes and docks change live, without refreshing."
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
