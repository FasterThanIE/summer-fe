"use client";

import type { SearchSort } from "@/lib/ai-search/types";
import { PARAM, readSort, sortParam } from "@/lib/ai-search/url-filters";
import { useResultsUrl } from "./results-url";

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: "recommended", label: "Preporučeno" },
  { value: "price", label: "Najniža cena" },
  { value: "beach", label: "Najbliže plaži" },
];

export function SortSelect() {
  const { params, change } = useResultsUrl();

  return (
    <>
      <label className="sr" htmlFor="sort">
        Sortiraj
      </label>
      <select
        id="sort"
        value={readSort(params)}
        onChange={(event) => change({ [PARAM.sort]: sortParam(event.currentTarget.value as SearchSort) })}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        <option value="score" disabled>
          Najbolje ocenjeno (nema ocena)
        </option>
      </select>
    </>
  );
}
