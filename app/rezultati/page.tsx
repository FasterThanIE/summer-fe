import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { EmptyState } from "@/components/results/empty-state";
import { FiltersPanel } from "@/components/results/filters-panel";
import { Pagination } from "@/components/results/pagination";
import { PropertyCard } from "@/components/results/property-card";
import { ResultsHeader } from "@/components/results/results-header";
import { ResultsUrlProvider } from "@/components/results/results-url";
import { SearchBar } from "@/components/results/search-bar";
import { SearchNotices } from "@/components/results/search-notices";
import { filterSections, resultsTitle, summaryChips, toPropertyCard } from "@/lib/ai-search/present";
import { searchAccommodations, todayInSerbia } from "@/lib/ai-search/search";
import type { SearchParams } from "@/lib/ai-search/types";
import {
  PARAM,
  SIDEBAR_PARAMS,
  filtersFromParams,
  flattenParams,
  offerHref,
  readPage,
  readSort,
  resultsHref,
} from "@/lib/ai-search/url-filters";
import { TooManyRequestsError } from "@/lib/laravel";
import { SAVED_SEARCHES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Rezultati pretrage · Sunce putovanja" };

type ResultsPageProps = { searchParams: Promise<SearchParams> };

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  return (
    <section className="results" aria-labelledby="results-title">
      <Suspense fallback={<ResultsLoading />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

function ResultsLoading() {
  return (
    <>
      <SearchBar />
      <p className="results__status" role="status">
        Tražimo najbolje ponude…
      </p>
    </>
  );
}

async function Results({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  await connection();
  const today = todayInSerbia();
  const filters = filtersFromParams(params, today);
  const sort = readSort(params);

  let results;
  try {
    results = await searchAccommodations(filters, readPage(params), sort);
  } catch (error) {
    return (
      <>
        <SearchBar />
        <p className="results__status" role="alert">
          {error instanceof TooManyRequestsError ? error.message : "Pretraga trenutno ne radi. Pokušaj ponovo za par trenutaka."}
        </p>
      </>
    );
  }

  const urlParams = flattenParams(params);
  const activeFilters = SIDEBAR_PARAMS.filter((name) => urlParams[name] !== undefined).length;
  const page = results.meta.current_page;

  return (
    <>
      <SearchBar />
      <ResultsUrlProvider params={urlParams}>
        <div className="results__inner">
          <FiltersPanel
            destinations={results.facets.destinations}
            sections={filterSections(results.facets)}
            today={today}
          />
          <div className="list">
            <ResultsHeader
              title={resultsTitle(filters, results.place_names)}
              count={results.meta.total}
              summary={summaryChips(filters, results.place_names)}
              saved={SAVED_SEARCHES}
              activeFilters={activeFilters}
            />
            <SearchNotices unknownPlaces={results.unknown_places} unknownAmenities={results.unknown_amenities} />
            <ul className="props">
              {results.data.length === 0 ? (
                <EmptyState
                  firstPageHref={results.meta.total > 0 ? resultsHref({ ...urlParams, [PARAM.page]: "1" }) : undefined}
                />
              ) : (
                results.data.map((result, i) => (
                  <PropertyCard
                    key={result.accommodation.id}
                    property={toPropertyCard(result, filters)}
                    href={offerHref(result.accommodation.id, result.price.id)}
                    index={i}
                    isTop={page === 1 && i === 0}
                  />
                ))
              )}
            </ul>
            <Pagination page={page} lastPage={results.meta.last_page} params={urlParams} />
          </div>
        </div>
      </ResultsUrlProvider>
    </>
  );
}
