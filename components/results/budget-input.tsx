import { useState } from "react";
import type { SidebarBudget } from "@/lib/ai-search/types";

type BudgetInputProps = {
  budget: SidebarBudget;
  onChange: (budget: SidebarBudget) => void;
};

function readAmount(text: string): number | null {
  const amount = Number.parseInt(text, 10);
  return Number.isInteger(amount) && amount > 0 ? amount : null;
}

export function BudgetInput({ budget, onChange }: BudgetInputProps) {
  const [perNight, setPerNight] = useState(budget.perNight);
  const [error, setError] = useState<string | null>(null);

  function commit(part: "minEur" | "maxEur", text: string) {
    const next = { ...budget, [part]: readAmount(text), perNight };

    if (next.minEur !== null && next.maxEur !== null && next.minEur > next.maxEur) {
      setError("Iznos „do“ ne može biti manji od iznosa „od“.");
      return;
    }

    setError(null);

    if (next[part] !== budget[part]) {
      onChange(next);
    }
  }

  function switchPeriod(nextPerNight: boolean) {
    setPerNight(nextPerNight);

    if ((budget.minEur !== null || budget.maxEur !== null) && nextPerNight !== budget.perNight) {
      onChange({ ...budget, perNight: nextPerNight });
    }
  }

  return (
    <fieldset className="fgroup">
      <legend>Budžet (EUR)</legend>
      <div className="range">
        {(["minEur", "maxEur"] as const).map((part) => (
          <label key={part} className="stepper budget">
            <span className="stepper__unit">{part === "minEur" ? "od" : "do"}</span>
            <input
              key={budget[part] ?? "none"}
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="—"
              aria-label={part === "minEur" ? "Najmanje EUR" : "Najviše EUR"}
              aria-invalid={error !== null}
              aria-describedby={error ? "budget-error" : undefined}
              defaultValue={budget[part] ?? ""}
              onBlur={(event) => commit(part, event.currentTarget.value)}
              onKeyDown={(event) => event.key === "Enter" && commit(part, event.currentTarget.value)}
            />
          </label>
        ))}
      </div>
      {error && (
        <p id="budget-error" className="field-error" role="alert">
          {error}
        </p>
      )}
      <div className="seg budget__per" role="group" aria-label="Budžet važi za">
        <button type="button" aria-pressed={!perNight} onClick={() => switchPeriod(false)}>
          ceo boravak
        </button>
        <button type="button" aria-pressed={perNight} onClick={() => switchPeriod(true)}>
          po noći
        </button>
      </div>
    </fieldset>
  );
}
