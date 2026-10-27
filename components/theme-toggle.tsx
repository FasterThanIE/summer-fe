"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme";

function readMode(): ThemeMode {
  return document.documentElement.getAttribute("data-mode") === "dark" ? "dark" : "light";
}

function readStoredMode(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function readSystemMode(): ThemeMode {
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyMode(mode: ThemeMode): void {
  document.documentElement.setAttribute("data-mode", mode);
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, readMode, (): ThemeMode => "light");
  const isDark = mode === "dark";

  useLayoutEffect(() => {
    applyMode(readStoredMode() ?? readSystemMode());
  }, []);

  function toggle(): void {
    const next: ThemeMode = isDark ? "light" : "dark";
    applyMode(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Prebaci na dnevnu temu" : "Prebaci na nocnu temu"}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </svg>
        <svg className="i-moon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
        </svg>
      </span>
      <span className="theme-toggle__label">{isDark ? "Noc" : "Dan"}</span>
    </button>
  );
}
