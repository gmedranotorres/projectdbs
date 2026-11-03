import { Bike, Dock, SpinningWheel, StreetScene } from "@/components/bikes";
import { ButtonLink, Card, PageHeader } from "@/components/ui";

// What a signed-out visitor sees at "/": what Estaciones is, and the way in.
export function Welcome() {
  return (
    <div className="space-y-6">
      <StreetScene className="h-56 rounded-card border border-line md:h-72" />
      <PageHeader
        title="See the bikes before you walk to the dock"
        description="Follow the Divvy stations you use, and watch bikes and docks change live, without refreshing."
      />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/sign-up">Sign up</ButtonLink>
        <ButtonLink href="/sign-in" variant="secondary">
          Sign in
        </ButtonLink>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        <li>
          <Card className="h-full">
            <Dock className="h-8 w-14 text-dock" />
            <h2 className="mt-2 font-display text-heading">Choose your stations</h2>
            <p className="mt-1 text-sm text-muted">Follow up to 20, from over 2,000 across the system.</p>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <Bike type="electric" className="h-8 w-14 text-ebike" />
            <h2 className="mt-2 font-display text-heading">Watch them change</h2>
            <p className="mt-1 text-sm text-muted">Classic bikes, e-bikes and open docks update on their own.</p>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <SpinningWheel spinning className="size-8 text-accent" />
            <h2 className="mt-2 font-display text-heading">Know it&apos;s current</h2>
            <p className="mt-1 text-sm text-muted">The page always says how fresh the data is, and when it isn&apos;t.</p>
          </Card>
        </li>
      </ul>
    </div>
  );
}
