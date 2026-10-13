import { Button } from "@/components/ui/button";
import { Loading, Notice, StateMessage } from "@/components/ui/states";
import { Specimen } from "./section";

// Section 6. What the site shows when a list is empty, while it loads, when
// loading fails, and after something is saved.
export function UiStates() {
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
      <Specimen title="Empty">
        <StateMessage kind="empty" title="No spots match this filter">
          <Button variant="secondary">Clear filters</Button>
        </StateMessage>
      </Specimen>

      <Specimen title="Loading">
        <Loading label="Loading spots…" />
      </Specimen>

      <Specimen title="Error">
        <StateMessage kind="error" title="Couldn't load spots">
          <Button variant="secondary">Try again</Button>
        </StateMessage>
      </Specimen>

      <Specimen title="Success">
        <Notice>Saved</Notice>
      </Specimen>
    </div>
  );
}
