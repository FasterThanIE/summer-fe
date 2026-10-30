import type { CSSProperties } from "react";
import type { FilterSection } from "@/lib/types";
import { Icon } from "../icons";

type OptionGroupProps = {
  section: FilterSection;
  selected: string[];
  onChange: (selected: string[]) => void;
  single?: boolean;
};

export function OptionGroup({ section, selected, onChange, single = false }: OptionGroupProps) {
  function toggle(value: string, checked: boolean) {
    if (single) {
      onChange(checked ? [value] : []);
      return;
    }

    onChange(checked ? [...selected, value] : selected.filter((item) => item !== value));
  }

  return (
    <fieldset className="fgroup">
      <legend>{section.legend}</legend>
      <div className="opts">
        {section.options.map((option) => (
          <label key={option.value} className="opt">
            <input
              type="checkbox"
              name={section.name}
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={(event) => toggle(option.value, event.currentTarget.checked)}
            />
            {option.logo ? (
              <span className="opt__icon opt__icon--logo" style={{ "--c": option.logo.color } as CSSProperties}>
                {option.logo.text}
              </span>
            ) : (
              <span className="opt__icon">{option.icon && <Icon name={option.icon} />}</span>
            )}
            <span className="opt__text">
              {option.label}
              {option.sub && <span className="opt__sub">{option.sub}</span>}
            </span>
            <span className="opt__count">{option.count}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
