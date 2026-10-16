type NightsStepperProps = {
  value: number;
  min?: number;
  max?: number;
};

export function NightsStepper({ value, min = 1, max = 30 }: NightsStepperProps) {
  return (
    <fieldset className="fgroup">
      <legend>Broj noci</legend>
      <div className="stepper">
        <button type="button" aria-label="Jedna noc manje" disabled={value <= min}>
          &minus;
        </button>
        <div className="stepper__val">
          <input type="number" inputMode="numeric" min={min} max={max} aria-label="Broj noci" defaultValue={value} />
          <span className="stepper__unit">noci</span>
        </div>
        <button type="button" aria-label="Jedna noc vise" disabled={value >= max}>
          +
        </button>
      </div>
    </fieldset>
  );
}
