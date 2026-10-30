"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { SELECTED_PRICE_PARAM } from "@/lib/ai-search/url-filters";
import { paidPrice } from "@/lib/offers";
import type { DetailUnit } from "@/lib/types";
import { UnitSection } from "./info-sections";
import { PriceBox } from "./price-box";
import { PriceListSection } from "./price-list";

type DetailBodyProps = {
  units: DetailUnit[];
  initialPriceId: number | null;
  children: ReactNode;
};

export function DetailBody({ units, initialPriceId, children }: DetailBodyProps) {
  const offers = units.flatMap((unit) => unit.prices.map((price) => ({ unit, price })));
  const cheapest = offers.reduce<(typeof offers)[number] | null>(
    (best, offer) => (best === null || paidPrice(offer.price) < paidPrice(best.price) ? offer : best),
    null,
  );
  const nightsOptions = [...new Set(offers.map((offer) => offer.price.nights))].sort((first, second) => first - second);

  const [selectedPriceId, setSelectedPriceId] = useState(
    offers.some((offer) => offer.price.id === initialPriceId) ? initialPriceId : (cheapest?.price.id ?? null),
  );
  const selected = offers.find((offer) => offer.price.id === selectedPriceId) ?? null;
  const [nights, setNights] = useState(selected?.price.nights ?? nightsOptions[0] ?? 0);

  function select(priceId: number) {
    setSelectedPriceId(priceId);
    window.history.replaceState(null, "", `?${SELECTED_PRICE_PARAM}=${priceId}`);
  }

  const shownUnit = selected?.unit ?? units[0];

  return (
    <div className="detail__body">
      <div className="sections">
        <PriceListSection
          units={units}
          nightsOptions={nightsOptions}
          nights={nights}
          onNightsChange={setNights}
          selectedPriceId={selectedPriceId}
          onSelect={select}
        />
        {shownUnit && <UnitSection unit={shownUnit} />}
        {children}
      </div>
      <aside className="side side--sticky">
        <PriceBox offer={selected} />
      </aside>
    </div>
  );
}
