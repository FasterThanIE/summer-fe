"use client";

import { useState } from "react";
import { Icon } from "../icons";

export function FiltersToggle({ activeFilters }: { activeFilters: number }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      className="filters-toggle"
      type="button"
      aria-controls="filters"
      aria-expanded={open}
      onClick={() => {
        setOpen(!open);
        document.getElementById("filters")?.classList.toggle("is-open", !open);
      }}
    >
      <Icon name="sliders" />
      Filteri <b>{activeFilters || ""}</b>
    </button>
  );
}
