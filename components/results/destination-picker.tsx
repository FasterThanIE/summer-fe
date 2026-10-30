import { useState } from "react";
import type { DestinationFacet } from "@/lib/ai-search/types";
import { Icon } from "../icons";

type DestinationPickerProps = {
  regions: DestinationFacet[];
  selected: string[];
  onApply: (selected: string[]) => void;
};

export function DestinationPicker({ regions, selected, onApply }: DestinationPickerProps) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(selected);
  const [expanded, setExpanded] = useState<number[]>([]);

  const label = selected.length > 0 ? (selected[0].split("/")[0] ?? "Izabrano") : "Sve destinacije";

  function toggle(entry: string, checked: boolean) {
    setPicked((current) => (checked ? [...current, entry] : current.filter((item) => item !== entry)));
  }

  function openPicker() {
    setPicked(selected);
    setOpen(!open);
  }

  return (
    <fieldset className="fgroup">
      <legend>Destinacija</legend>
      <button className="dest-btn" type="button" aria-expanded={open} aria-controls="dest-panel" onClick={openPicker}>
        <span className="dest-btn__icon" aria-hidden="true">
          <Icon name="pin" />
        </span>
        <span className="dest-btn__text">{label}</span>
        <b>{selected.length || ""}</b>
        <Icon name="chevronDown" className="dest-btn__chev" />
      </button>

      <div className="dest" id="dest-panel" hidden={!open}>
        <ul className="dest__list">
          {regions.map((region) => {
            const isExpanded = expanded.includes(region.id);

            return (
              <li key={region.id} className={`dest__region${isExpanded ? " is-open" : ""}`}>
                <div className="dest__row">
                  <label className="dest__check">
                    <input
                      type="checkbox"
                      checked={picked.includes(region.name)}
                      onChange={(event) => toggle(region.name, event.currentTarget.checked)}
                    />
                    <span className="dest__name">{region.name}</span>
                    <span className="dest__count">{region.count}</span>
                  </label>
                  {region.cities.length > 0 && (
                    <button
                      className="dest__exp"
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Sakrij" : "Prikaži"} mesta: ${region.name}`}
                      onClick={() =>
                        setExpanded((current) =>
                          isExpanded ? current.filter((id) => id !== region.id) : [...current, region.id],
                        )
                      }
                    >
                      <Icon name="chevronDown" />
                    </button>
                  )}
                </div>
                <ul className="dest__cities">
                  {region.cities.map((city) => {
                    const entry = `${city.name}/${region.name}`;

                    return (
                      <li key={city.id}>
                        <label className="dest__check dest__check--city">
                          <input
                            type="checkbox"
                            checked={picked.includes(entry)}
                            onChange={(event) => toggle(entry, event.currentTarget.checked)}
                          />
                          <span className="dest__name">{city.name}</span>
                          <span className="dest__count">{city.count}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        <div className="dest__foot">
          <button type="button" className="link-btn" onClick={() => setPicked([])}>
            Očisti izbor
          </button>
          <button
            type="button"
            className="dest__done"
            onClick={() => {
              setOpen(false);
              onApply(picked);
            }}
          >
            Gotovo
          </button>
        </div>
      </div>
    </fieldset>
  );
}
