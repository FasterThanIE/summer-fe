import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { srLatn } from "react-day-picker/locale";
import type { SidebarDates } from "@/lib/ai-search/types";
import { arrivalLabel, fromIso, parseArrival, toIso } from "@/lib/arrival-dates";
import { Icon } from "../icons";
import { useDebounced } from "./use-debounced";

type ArrivalPickerProps = {
  dates: SidebarDates;
  today: string;
  onChange: (dates: SidebarDates) => void;
};

export function ArrivalPicker({ dates, today, onChange }: ArrivalPickerProps) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState<string | null>(null);
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const applyFinishedRangeLater = useDebounced((range: DateRange | undefined) => {
    if (range?.from && range.to) {
      apply({ from: toIso(range.from), to: toIso(range.to) });
    }
  });

  function pick(range: DateRange | undefined) {
    setDraft(range);
    applyFinishedRangeLater(range);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function apply(next: SidebarDates) {
    if ((next.from && next.from < today) || (next.to && next.to < today)) {
      setError("Dolazak ne može biti u prošlosti.");
      return;
    }

    if (next.from && next.to && next.to < next.from) {
      setError("Datum „do“ ne može biti pre datuma „od“.");
      return;
    }

    setError(null);

    if (next.from !== dates.from || next.to !== dates.to) {
      onChange(next);
    }
  }

  function commitTyped() {
    if (typed === null) {
      return;
    }

    const next = parseArrival(typed);
    setTyped(null);

    if (next === null) {
      setError("Upiši datume kao 01.07.2027 – 10.07.2027.");
      return;
    }

    apply(next);
  }

  function openCalendar() {
    setDraft(dates.from ? { from: fromIso(dates.from), to: dates.to ? fromIso(dates.to) : undefined } : undefined);
    setOpen(!open);
  }

  return (
    <fieldset className="fgroup">
      <legend>Dolazak</legend>
      <div className="arrival" ref={root}>
        <div className="stepper arrival__field">
          <input
            type="text"
            inputMode="numeric"
            placeholder="dd.mm.gggg – dd.mm.gggg"
            aria-label="Dolazak od – do"
            aria-invalid={error !== null}
            aria-describedby={error ? "arrival-error" : undefined}
            value={typed ?? arrivalLabel(dates)}
            onFocus={() => setTyped(arrivalLabel(dates))}
            onChange={(event) => setTyped(event.currentTarget.value)}
            onBlur={commitTyped}
            onKeyDown={(event) => event.key === "Enter" && commitTyped()}
          />
          <button type="button" aria-label="Otvori kalendar" aria-expanded={open} aria-controls="arrival-calendar" onClick={openCalendar}>
            <Icon name="calendar" />
          </button>
        </div>

        {open && (
          <div className="arrival__pop" id="arrival-calendar">
            <DayPicker
              mode="range"
              locale={srLatn}
              numberOfMonths={1}
              selected={draft}
              onSelect={pick}
              resetOnSelect
              disabled={{ before: fromIso(today) }}
              startMonth={fromIso(today)}
              defaultMonth={draft?.from ?? fromIso(today)}
            />
            <div className="arrival__actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setOpen(false);
                  apply({ from: null, to: null });
                }}
              >
                Očisti
              </button>
              <button
                type="button"
                className="dest__done"
                disabled={!draft?.from}
                onClick={() => {
                  setOpen(false);
                  apply({ from: draft?.from ? toIso(draft.from) : null, to: draft?.to ? toIso(draft.to) : null });
                }}
              >
                Primeni
              </button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p id="arrival-error" className="field-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
