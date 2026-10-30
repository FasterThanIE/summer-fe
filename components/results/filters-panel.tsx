"use client";

import type { DestinationFacet } from "@/lib/ai-search/types";
import {
  BEACH_SLUGS,
  PARAM,
  UNIT_TYPE_SLUGS,
  budgetParam,
  checkInParam,
  offerParams,
  sidebarState,
  withRequired,
} from "@/lib/ai-search/url-filters";
import type { FilterSection } from "@/lib/types";
import { ArrivalPicker } from "./arrival-picker";
import { BudgetInput } from "./budget-input";
import { DestinationPicker } from "./destination-picker";
import { NightsStepper } from "./nights-stepper";
import { OptionGroup } from "./option-group";
import { PeopleCounter } from "./people-counter";
import { QueryEditor } from "./query-editor";
import { ResetLink } from "./reset-link";
import { useResultsUrl } from "./results-url";

type FiltersPanelProps = {
  destinations: DestinationFacet[];
  sections: Record<"beach" | "amenities" | "types" | "offers" | "agencies", FilterSection>;
  today: string;
};

export function FiltersPanel({ destinations, sections, today }: FiltersPanelProps) {
  const { params, change, isPending } = useResultsUrl();
  const state = sidebarState(params, destinations, today);

  function changeOffers(offers: string[]) {
    const added = offers.find((offer) => !state.offers.includes(offer));
    const specialOffers = ["first_minute", "last_minute"];
    const kept = added && specialOffers.includes(added) ? offers.filter((offer) => offer === added || !specialOffers.includes(offer)) : offers;
    change(offerParams(params, kept));
  }

  return (
    <aside className="filters" id="filters" aria-label="Filteri" aria-busy={isPending}>
      <div className="filters__head">
        <h2>Filteri</h2>
        <ResetLink className="link-btn">Poništi sve</ResetLink>
      </div>
      <QueryEditor />
      <DestinationPicker
        key={state.places.join(",")}
        regions={destinations}
        selected={state.places}
        onApply={(places) => change({ [PARAM.place]: withRequired(params[PARAM.place], places) })}
      />
      <ArrivalPicker
        dates={state.checkIn}
        today={today}
        onChange={(dates) => change({ [PARAM.checkIn]: checkInParam(dates), [PARAM.month]: null })}
      />
      <NightsStepper key={state.nights ?? "any"} value={state.nights} onChange={(nights) => change({ [PARAM.nights]: nights === null ? null : String(nights) })} />
      <PeopleCounter
        key={`${state.adults}-${state.kids}`}
        adults={state.adults}
        kids={state.kids}
        onChange={({ adults, kids }) => change({ [PARAM.adults]: String(adults), [PARAM.kids]: kids > 0 ? String(kids) : null })}
      />
      <BudgetInput
        key={budgetParam(state.budget) ?? "none"}
        budget={state.budget}
        onChange={(budget) => change({ [PARAM.budget]: budgetParam(budget) })}
      />
      <OptionGroup
        section={sections.beach}
        selected={state.beach ? [state.beach] : []}
        onChange={([band]) => change({ [PARAM.beach]: band ? BEACH_SLUGS[band as keyof typeof BEACH_SLUGS] : null })}
        single
      />
      <OptionGroup
        section={sections.amenities}
        selected={state.amenities}
        onChange={(amenities) => change({ [PARAM.amenities]: withRequired(params[PARAM.amenities], amenities) })}
      />
      <OptionGroup
        section={sections.types}
        selected={state.types}
        onChange={(types) =>
          change({
            [PARAM.type]: withRequired(
              params[PARAM.type],
              types.map((type) => UNIT_TYPE_SLUGS[type as keyof typeof UNIT_TYPE_SLUGS]),
            ),
          })
        }
      />
      <OptionGroup section={sections.offers} selected={state.offers} onChange={changeOffers} />
      <OptionGroup
        section={sections.agencies}
        selected={state.agencies}
        onChange={(agencies) => change({ [PARAM.agency]: agencies.length > 0 ? agencies.join(",") : null })}
      />
    </aside>
  );
}
