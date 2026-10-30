"use client";

import type { SubmitEvent } from "react";
import { useLastSearch } from "@/lib/ai-search/last-search";
import { useAiSearch } from "@/lib/ai-search/use-ai-search";

const EXAMPLE_QUERIES = ["Naksos, avgust, 7 dana za dvoje", "Halkidiki sa decom do 1200 EUR", "Krf, apartman blizu plaže"];

type HeroProps = {
  hint?: string;
};

export function Hero({ hint = "Destinacija, termin, broj osoba, budžet, želje" }: HeroProps) {
  const { search, isSearching, error } = useAiSearch();
  const { text } = useLastSearch();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    search(String(new FormData(event.currentTarget).get("q") ?? ""));
  }

  return (
    <main className="hero">
      <p className="eyebrow">Leto 2027 · Grčka</p>
      <h1>Planiraš putovanje?</h1>
      <p className="subtitle">
        Unesi gde bi želeo da ideš, koliko novca da potrošiš i sve ostale relevantne podatke ispod
      </p>

      <form className="prompt" onSubmit={handleSubmit} aria-busy={isSearching}>
        <label className="sr" htmlFor="trip">
          Opis putovanja
        </label>
        <textarea
          key={text}
          id="trip"
          name="q"
          rows={3}
          defaultValue={text}
          required
          placeholder="Želim da letujem u Grčkoj u julu, 10 dana, idemo nas 2 sa 2 dece, nešto do 1000 eur blizu mora"
        />
        <div className="prompt__bar">
          <span className="hint">{hint}</span>
          <button className="btn" type="submit" disabled={isSearching}>
            {isSearching ? "Tražim ponude…" : "Pronađi ponude"} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </form>
      {error && (
        <p className="notices__item notices__item--error search-error" role="alert">
          {error}
        </p>
      )}

      <div className="examples">
        <span className="examples__label">Ili probaj neki primer:</span>
        {EXAMPLE_QUERIES.map((example) => (
          <button key={example} className="chip" type="button" disabled={isSearching} onClick={() => search(example)}>
            {example}
          </button>
        ))}
      </div>
    </main>
  );
}
