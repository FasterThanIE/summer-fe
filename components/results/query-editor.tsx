import type { SubmitEvent } from "react";
import { useLastSearch } from "@/lib/ai-search/last-search";
import { useAiSearch } from "@/lib/ai-search/use-ai-search";

export function QueryEditor() {
  const { search, isSearching, error } = useAiSearch();
  const { text } = useLastSearch();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    search(String(new FormData(event.currentTarget).get("q") ?? ""));
  }

  return (
    <form className="fgroup prompt-edit" onSubmit={handleSubmit} aria-busy={isSearching}>
      <label className="prompt-edit__label" htmlFor="f-q">
        Tvoj upit
      </label>
      <textarea key={text} id="f-q" name="q" rows={4} placeholder="Opiši putovanje…" defaultValue={text} required />
      {error && (
        <p className="notices__item notices__item--error" role="alert">
          {error}
        </p>
      )}
      <button className="prompt-edit__btn" type="submit" disabled={isSearching}>
        {isSearching ? "Tražim…" : "Primeni izmene"} <span aria-hidden="true">&rarr;</span>
      </button>
    </form>
  );
}
