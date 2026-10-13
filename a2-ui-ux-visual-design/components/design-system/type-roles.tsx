import type { Theme } from "@/components/ui/theme";
import { filters, siteLine, siteName, spots } from "@/content/spots";

// Section 2. Each role is set in the site's own words.
export function TypeRoles({ theme }: { theme: Theme }) {
  const samples: Record<keyof Theme["type"], string> = {
    display: siteName,
    heading: spots[3].name,
    body: siteLine,
    label: filters.join(" · "),
  };
  return (
    <dl className="divide-y divide-(--ui-border) border-y border-(--ui-border)">
      {(Object.keys(theme.type) as (keyof Theme["type"])[]).map((key) => {
        const role = theme.type[key];
        return (
          <div key={key} className="grid gap-x-8 gap-y-3 py-6 md:grid-cols-[14rem_1fr] md:items-baseline">
            <dt>
              <p className="font-medium">{role.label}</p>
              <p className="ui-label ui-muted mt-1 font-normal">
                {role.font} · {role.sizeLabel} · weight {role.weight}
              </p>
            </dt>
            <dd className={`ui-${key} min-w-0`}>{samples[key]}</dd>
          </div>
        );
      })}
    </dl>
  );
}
