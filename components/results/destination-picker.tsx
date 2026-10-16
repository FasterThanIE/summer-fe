import type { DestinationRegion } from "@/lib/types";
import { Icon } from "../icons";

type DestinationPickerProps = {
  label: string;
  selectedCount: number;
  regions: DestinationRegion[];
  open?: boolean;
};

export function DestinationPicker({ label, selectedCount, regions, open = false }: DestinationPickerProps) {
  return (
    <fieldset className="fgroup">
      <legend>Destinacija</legend>
      <button className="dest-btn" type="button" aria-expanded={open} aria-controls="dest-panel">
        <span className="dest-btn__icon" aria-hidden="true">
          <Icon name="pin" />
        </span>
        <span className="dest-btn__text">{label}</span>
        <b>{selectedCount || ""}</b>
        <Icon name="chevronDown" className="dest-btn__chev" />
      </button>

      <div className="dest" id="dest-panel" hidden={!open}>
        <ul className="dest__list">
          {regions.map((region) => (
            <RegionItem key={region.region} region={region} />
          ))}
        </ul>
        <div className="dest__foot">
          <button type="button" className="link-btn">
            Ocisti izbor
          </button>
          <button type="button" className="dest__done">
            Gotovo
          </button>
        </div>
      </div>
    </fieldset>
  );
}

function RegionItem({ region }: { region: DestinationRegion }) {
  const hasCities = region.cities.length > 1;

  return (
    <li className={`dest__region${region.open ? " is-open" : ""}`}>
      <div className="dest__row">
        <label className="dest__check">
          <input type="checkbox" defaultChecked={region.checked} />
          <span className="dest__name">{region.region}</span>
          <span className="dest__count">{region.count}</span>
        </label>
        {hasCities && (
          <button
            className="dest__exp"
            type="button"
            aria-expanded={region.open}
            aria-label={`${region.open ? "Sakrij" : "Prikazi"} mesta: ${region.region}`}
          >
            <Icon name="chevronDown" />
          </button>
        )}
      </div>
      {hasCities && (
        <ul className="dest__cities">
          {region.cities.map((city) => (
            <li key={city.name}>
              <label className="dest__check dest__check--city">
                <input type="checkbox" defaultChecked={city.checked} />
                <span className="dest__name">{city.name}</span>
                <span className="dest__count">{city.count}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
