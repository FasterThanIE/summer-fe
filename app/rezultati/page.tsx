import type { Metadata } from "next";
import { FiltersPanel } from "@/components/results/filters-panel";
import { PropertyCard } from "@/components/results/property-card";
import { ResultsHeader } from "@/components/results/results-header";
import { SearchBar } from "@/components/results/search-bar";
import { DESTINATIONS, FILTER_SECTIONS, PROPERTIES, RESULTS_SUMMARY, SAVED_SEARCHES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Rezultati pretrage · Sunce putovanja" };

const QUERY = "Zelim da letujem u grckoj u Julu, 7 noci, idemo nas 2, nesto do 1000 eur blizu mora";

export default function ResultsPage() {
  return (
    <section className="results" aria-labelledby="results-title">
      <SearchBar value={QUERY} />
      <div className="results__inner">
        <FiltersPanel
          query={QUERY}
          destinationLabel="Kasandra"
          selectedDestinations={1}
          regions={DESTINATIONS}
          nights={7}
          adults={2}
          kids={0}
          sections={FILTER_SECTIONS}
        />
        <div className="list">
          <ResultsHeader
            title="Grcka"
            count={PROPERTIES.length}
            summary={RESULTS_SUMMARY}
            saved={SAVED_SEARCHES}
            activeFilters={1}
          />
          <ul className="props">
            {PROPERTIES.map((property, i) => (
              <PropertyCard
                key={property.slug}
                property={property}
                href="/smestaj"
                index={i}
                isTop={i === 0}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
