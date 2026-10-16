import type { CSSProperties } from "react";
import type { FilterSection } from "@/lib/types";
import { Icon } from "../icons";

export function OptionGroup({ section }: { section: FilterSection }) {
  return (
    <fieldset className="fgroup">
      <legend>{section.legend}</legend>
      <div className="opts">
        {section.options.map((option) => (
          <label key={option.value} className="opt">
            <input type="checkbox" name={section.name} value={option.value} defaultChecked={option.checked} />
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
