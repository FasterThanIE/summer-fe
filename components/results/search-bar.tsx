"use client";

import type { SubmitEvent } from "react";
import Link from "next/link";
import { useLastSearch } from "@/lib/ai-search/last-search";
import { useAiSearch } from "@/lib/ai-search/use-ai-search";
import { Icon } from "../icons";

type SearchBarProps = {
  backHref?: string;
};

export function SearchBar({ backHref = "/" }: SearchBarProps) {
  const { search, isSearching, error } = useAiSearch();
  const { text } = useLastSearch();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    search(String(new FormData(event.currentTarget).get("q") ?? ""));
  }

  return (
    <div className="results__bar">
      <form className="results__bar-inner" onSubmit={handleSubmit} aria-busy={isSearching}>
        <Link className="back" href={backHref} aria-label="Nazad na početnu">
          <Icon name="arrowLeft" />
        </Link>
        <div className="re-search">
          <Icon name="search" />
          <label className="sr" htmlFor="re-q">
            Izmeni pretragu
          </label>
          <input
            key={text}
            id="re-q"
            name="q"
            type="text"
            autoComplete="off"
            placeholder="Opiši putovanje…"
            defaultValue={text}
            required
          />
          <button className="btn" type="submit" disabled={isSearching}>
            <span className="lbl">{isSearching ? "Tražim…" : "Traži"}</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </form>
      {error && (
        <p className="notices__item notices__item--error search-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
