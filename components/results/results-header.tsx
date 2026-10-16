import type { SavedSearch, SummaryChip } from "@/lib/types";
import { Icon } from "../icons";
import { SavedSearchesMenu } from "./saved-searches-menu";

const SORT_OPTIONS = [
  { value: "top", label: "Preporuceno" },
  { value: "price", label: "Najniza cena" },
  { value: "beach", label: "Najblize plazi" },
  { value: "score", label: "Najbolje ocenjeno" },
];

type ResultsHeaderProps = {
  title: string;
  count: number;
  summary: SummaryChip[];
  saved: SavedSearch[];
  activeFilters: number;
  sort?: string;
};

export function ResultsHeader({ title, count, summary, saved, activeFilters, sort = "top" }: ResultsHeaderProps) {
  return (
    <div className="list__head">
      <div>
        <h1 id="results-title" tabIndex={-1}>
          {title}{" "}
          <span className="count">
            {count} {count === 1 ? "smestaj" : "smestaja"}
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
        <SavedSearchesMenu saved={saved} />
        <button className="save-btn" type="button">
          <Icon name="bookmark" />
          Sacuvaj pretragu
        </button>
        <button className="filters-toggle" type="button" aria-controls="filters" aria-expanded={false}>
          <Icon name="sliders" />
          Filteri <b>{activeFilters || ""}</b>
        </button>
        <label className="sr" htmlFor="sort">
          Sortiraj
        </label>
        <select id="sort" defaultValue={sort}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
