import type { SavedSearch, SummaryChip } from "@/lib/types";
import { Icon } from "../icons";
import { FiltersToggle } from "./filters-toggle";
import { SavedSearchesMenu } from "./saved-searches-menu";
import { SortSelect } from "./sort-select";

type ResultsHeaderProps = {
  title: string;
  count: number;
  summary: SummaryChip[];
  saved: SavedSearch[];
  activeFilters: number;
};

export function ResultsHeader({ title, count, summary, saved, activeFilters }: ResultsHeaderProps) {
  return (
    <div className="list__head">
      <div>
        <h1 id="results-title" tabIndex={-1}>
          {title}{" "}
          <span className="count">
            {count} {count === 1 ? "smeštaj" : "smeštaja"}
          </span>
        </h1>
        <div className="summary">
          {summary.map((chip) => (
            <span key={chip.label}>
              <Icon name={chip.icon} />
              {chip.label}
            </span>
          ))}
        </div>
      </div>
      <div className="sort">
        <div className="is-unavailable" title="Još nije povezano: nema sačuvanih pretraga">
          <SavedSearchesMenu saved={saved} />
        </div>
        <button className="save-btn is-unavailable" type="button" title="Još nije povezano: nema sačuvanih pretraga">
          <Icon name="bookmark" />
          Sačuvaj pretragu
        </button>
        <FiltersToggle activeFilters={activeFilters} />
        <SortSelect />
      </div>
    </div>
  );
}
