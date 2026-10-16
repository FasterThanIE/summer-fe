type CounterRowProps = {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  lessLabel: string;
  moreLabel: string;
};

function CounterRow({ label, sub, value, min, max, lessLabel, moreLabel }: CounterRowProps) {
  return (
    <div className="ppl__row">
      <span className="ppl__label">
        {label}
        <small>{sub}</small>
      </span>
      <div className="mini">
        <button type="button" aria-label={lessLabel} disabled={value <= min}>
          &minus;
        </button>
        <output aria-live="polite">{value}</output>
        <button type="button" aria-label={moreLabel} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  );
}

export function PeopleCounter({ adults, kids }: { adults: number; kids: number }) {
  return (
    <fieldset className="fgroup">
      <legend>Broj osoba</legend>
      <div className="ppl">
        <CounterRow
          label="Odrasli"
          sub="18+ godina"
          value={adults}
          min={1}
          max={8}
          lessLabel="Jedna odrasla osoba manje"
          moreLabel="Jedna odrasla osoba vise"
        />
        <CounterRow
          label="Deca"
          sub="0 – 17 godina"
          value={kids}
          min={0}
          max={6}
          lessLabel="Jedno dete manje"
          moreLabel="Jedno dete vise"
        />
      </div>
    </fieldset>
  );
}
