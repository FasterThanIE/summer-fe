import type { DestinationRegion, FilterSection } from "@/lib/types";
import { DestinationPicker } from "./destination-picker";
import { NightsStepper } from "./nights-stepper";
import { OptionGroup } from "./option-group";
import { PeopleCounter } from "./people-counter";
import { QueryEditor } from "./query-editor";

type FiltersPanelProps = {
  query: string;
  destinationLabel: string;
  selectedDestinations: number;
  regions: DestinationRegion[];
  destinationsOpen?: boolean;
  nights: number;
  adults: number;
  kids: number;
  sections: FilterSection[];
  isOpen?: boolean;
};

export function FiltersPanel({
  query,
  destinationLabel,
  selectedDestinations,
  regions,
  destinationsOpen,
  nights,
  adults,
  kids,
  sections,
  isOpen = false,
}: FiltersPanelProps) {
  return (
    <aside className={`filters${isOpen ? " is-open" : ""}`} id="filters" aria-label="Filteri">
      <div className="filters__head">
        <h2>Filteri</h2>
        <button className="link-btn" type="button">
          Ponisti sve
        </button>
      </div>
      <QueryEditor value={query} />
      <DestinationPicker
        label={destinationLabel}
        selectedCount={selectedDestinations}
        regions={regions}
        open={destinationsOpen}
      />
      <NightsStepper value={nights} />
      <PeopleCounter adults={adults} kids={kids} />
      {sections.map((section) => (
        <OptionGroup key={section.name} section={section} />
      ))}
    </aside>
  );
}
