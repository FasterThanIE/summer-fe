import { useState } from "react";
import { useDebounced } from "./use-debounced";

type CounterRowProps = {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  lessLabel: string;
  moreLabel: string;
  inputLabel: string;
  onChange: (value: number) => void;
};

function CounterRow({ label, sub, value, min, max, lessLabel, moreLabel, inputLabel, onChange }: CounterRowProps) {
  const [typed, setTyped] = useState<string | null>(null);

  function type(text: string) {
    setTyped(text);
    const count = Number.parseInt(text, 10);

    if (Number.isInteger(count) && count >= min && count <= max) {
      onChange(count);
    }
  }

  return (
    <div className="ppl__row">
      <span className="ppl__label">
        {label}
        <small>{sub}</small>
      </span>
      <div className="mini">
        <button type="button" aria-label={lessLabel} disabled={value <= min} onClick={() => onChange(value - 1)}>
          &minus;
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          aria-label={inputLabel}
          value={typed ?? String(value)}
          onFocus={(event) => {
            setTyped(String(value));
            event.currentTarget.select();
          }}
          onChange={(event) => type(event.currentTarget.value)}
          onBlur={() => setTyped(null)}
        />
        <button type="button" aria-label={moreLabel} disabled={value >= max} onClick={() => onChange(value + 1)}>
          +
        </button>
      </div>
    </div>
  );
}

type People = { adults: number; kids: number };

type PeopleCounterProps = People & {
  onChange: (people: People) => void;
};

export function PeopleCounter({ adults, kids, onChange }: PeopleCounterProps) {
  const [people, setPeople] = useState<People>({ adults, kids });
  const applyLater = useDebounced(onChange);

  function update(next: People) {
    setPeople(next);
    applyLater(next);
  }

  return (
    <fieldset className="fgroup">
      <legend>Broj osoba</legend>
      <div className="ppl">
        <CounterRow
          label="Odrasli"
          sub="18+ godina"
          value={people.adults}
          min={1}
          max={20}
          lessLabel="Jedna odrasla osoba manje"
          moreLabel="Jedna odrasla osoba više"
          inputLabel="Broj odraslih"
          onChange={(value) => update({ ...people, adults: value })}
        />
        <CounterRow
          label="Deca"
          sub="0 – 17 godina"
          value={people.kids}
          min={0}
          max={10}
          lessLabel="Jedno dete manje"
          moreLabel="Jedno dete više"
          inputLabel="Broj dece"
          onChange={(value) => update({ ...people, kids: value })}
        />
      </div>
    </fieldset>
  );
}
