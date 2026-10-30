"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { rememberSearch } from "./last-search";
import type { Interpretation } from "./types";
import { paramsFromFilters, resultsHref } from "./url-filters";

export function useAiSearch() {
  const router = useRouter();
  const [isSearching, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function search(text: string) {
    if (text.trim() === "") {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const body = await response.json();

        if (!response.ok) {
          setError(body.message ?? "Pretraga trenutno ne radi.");
          return;
        }

        const answer = body as Interpretation;
        rememberSearch({ text, errors: answer.errors, notices: answer.notices });
        router.push(resultsHref(paramsFromFilters(answer.filters)));
      } catch {
        setError("Pretraga trenutno ne radi.");
      }
    });
  }

  return { search, isSearching, error };
}
