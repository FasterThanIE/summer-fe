"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, use, useEffect, useOptimistic, useRef, useTransition } from "react";
import { PARAM, resultsHref } from "@/lib/ai-search/url-filters";

type ResultsUrl = {
  params: Record<string, string>;
  change: (changes: Record<string, string | null>) => void;
  isPending: boolean;
};

const ResultsUrlContext = createContext<ResultsUrl | null>(null);

export function ResultsUrlProvider({ params, children }: { params: Record<string, string>; children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticParams, setOptimisticParams] = useOptimistic(params);
  const latest = useRef(optimisticParams);

  useEffect(() => {
    latest.current = optimisticParams;
  }, [optimisticParams]);

  function change(changes: Record<string, string | null>) {
    const next = { ...latest.current };

    for (const [name, value] of Object.entries(changes)) {
      if (value === null) {
        delete next[name];
      } else {
        next[name] = value;
      }
    }

    delete next[PARAM.page];
    latest.current = next;
    startTransition(() => {
      setOptimisticParams(next);
      router.push(resultsHref(next), { scroll: false });
    });
  }

  return <ResultsUrlContext value={{ params: optimisticParams, change, isPending }}>{children}</ResultsUrlContext>;
}

export function useResultsUrl(): ResultsUrl {
  const resultsUrl = use(ResultsUrlContext);

  if (resultsUrl === null) {
    throw new Error("useResultsUrl() needs a <ResultsUrlProvider> around it.");
  }

  return resultsUrl;
}
