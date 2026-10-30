import { useState } from "react";
import { useDebounced } from "./use-debounced";

type NightsStepperProps = {
  value: number | null;
  onChange: (nights: number | null) => void;
  min?: number;
  max?: number;
};

export function NightsStepper({ value, onChange, min = 1, max = 30 }: NightsStepperProps) {
  const [nights, setNights] = useState(value);
  const [typed, setTyped] = useState<string | null>(null);
  const applyLater = useDebounced(onChange);

  function update(next: number | null) {
    setNights(next);
    applyLater(next);
  }

  function type(text: string) {
    setTyped(text);
    const count = Number.parseInt(text, 10);

    if (text === "") {
      update(null);
    } else if (Number.isInteger(count) && count >= min && count <= max) {
      update(count);
    }
  }

  const shown = typed ?? (nights === null ? "" : String(nights));

  return (
    <fieldset className="fgroup">
      <legend>Broj noći</legend>
      <div className="stepper">
        <button
          type="button"
          aria-label="Jedna noć manje"
          disabled={nights === null || nights <= min}
          onClick={() => nights !== null && update(nights - 1)}
        >
          &minus;
        </button>
        <div className="stepper__val">
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            aria-label="Broj noći"
            placeholder="sve"
            value={shown}
            style={{ width: `${Math.max(shown.length, 3)}ch` }}
            onFocus={(event) => {
              setTyped(nights === null ? "" : String(nights));
              event.currentTarget.select();
            }}
            onChange={(event) => type(event.currentTarget.value)}
            onBlur={() => setTyped(null)}
          />
          <span className="stepper__unit">noći</span>
        </div>
        <button
          type="button"
          aria-label="Jedna noć više"
          disabled={nights !== null && nights >= max}
          onClick={() => update(nights === null ? 7 : nights + 1)}
        >
          +
        </button>
      </div>
    </fieldset>
  );
}
