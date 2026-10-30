import { useEffect, useRef } from "react";

export function useDebounced<T>(apply: (value: T) => void, delayMs = 700): (value: T) => void {
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (value: T) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => apply(value), delayMs);
  };
}
