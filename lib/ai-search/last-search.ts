import { useSyncExternalStore } from "react";
import type { AiError, AiNotice, LastSearch } from "./types";

const STORAGE_KEY = "summer:last-search";
const NOTHING: LastSearch = { text: "", errors: [], notices: [] };

const listeners = new Set<() => void>();
let snapshot: LastSearch | null = null;

function isAiError(item: unknown): item is AiError {
  const error = item as Partial<AiError> | null;
  return typeof error?.field === "string" && typeof error.value === "string";
}

function isAiNotice(item: unknown): item is AiNotice {
  const notice = item as Partial<AiNotice> | null;
  return (
    typeof notice?.field === "string" &&
    typeof notice.wish === "string" &&
    (notice.kind === "not_filterable" || notice.kind === "other_currency")
  );
}

function load(): LastSearch {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Record<keyof LastSearch, unknown>> | null;

    if (stored === null) {
      return NOTHING;
    }

    return {
      text: typeof stored.text === "string" ? stored.text : "",
      errors: Array.isArray(stored.errors) ? stored.errors.filter(isAiError) : [],
      notices: Array.isArray(stored.notices) ? stored.notices.filter(isAiNotice) : [],
    };
  } catch {
    return NOTHING;
  }
}

function getSnapshot(): LastSearch {
  snapshot ??= load();
  return snapshot;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function rememberSearch(search: LastSearch): void {
  snapshot = search;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(search));
  } catch {
  }

  listeners.forEach((listener) => listener());
}

export function forgetSearch(): void {
  snapshot = NOTHING;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
  }

  listeners.forEach((listener) => listener());
}

export function useLastSearch(): LastSearch {
  return useSyncExternalStore(subscribe, getSnapshot, () => NOTHING);
}
