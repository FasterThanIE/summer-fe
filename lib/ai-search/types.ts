import type { z } from "zod";
import type { Price, Unit, UnitType } from "@/lib/types";
import type { createSearchFiltersSchema } from "./filters";

export type SearchFilters = z.infer<ReturnType<typeof createSearchFiltersSchema>>;

export type Importance = "required" | "preferred" | "avoided" | "excluded";

export type AiError = { field: string; value: string };

export type AiNotice = { field: string; kind: "not_filterable" | "other_currency"; wish: string };

export type Interpretation = { filters: SearchFilters; errors: AiError[]; notices: AiNotice[] };

export type LastSearch = { text: string; errors: AiError[]; notices: AiNotice[] };

export type PlaceFilter = NonNullable<SearchFilters["places"]>[number] & { within?: string };

export type EffectiveFilters = Omit<SearchFilters, "places" | "check_in"> & {
  places: PlaceFilter[] | null;
  check_in: { from: string | null; to: string | null; importance: "required" | "preferred" } | null;
  agencies: string[] | null;
};

export type SearchSort = "recommended" | "price" | "beach";

export type BeachBand = "beachfront" | "near" | "short_walk" | "walk" | "far";

export type SearchParams = Record<string, string | string[] | undefined>;

export type SidebarBudget = { minEur: number | null; maxEur: number | null; perNight: boolean };

export type SidebarDates = { from: string | null; to: string | null };

export type SidebarState = {
  places: string[];
  nights: number | null;
  adults: number;
  kids: number;
  checkIn: SidebarDates;
  budget: SidebarBudget;
  beach: BeachBand | null;
  amenities: string[];
  types: UnitType[];
  offers: string[];
  agencies: string[];
};

export type SearchResult = {
  accommodation: {
    id: number;
    name: string;
    stars: number | null;
    photo: string | null;
    beach_distance_m: number | null;
    latitude: string | null;
    longitude: string | null;
    city: { id: number; name: string };
    regions: string[];
    agency: { id: number; name: string };
    amenities: string[];
  };
  unit: Unit;
  price: Price;
};

export type DestinationFacet = {
  id: number;
  name: string;
  count: number;
  cities: { id: number; name: string; count: number }[];
};

export type DealOffer = SearchResult & { destination: string };

export type Facets = {
  destinations: DestinationFacet[];
  beach: Record<BeachBand, number>;
  amenities: Record<string, number>;
  unit_types: Record<UnitType, number>;
  offers: { first_minute: number; last_minute: number; discount: number };
  agencies: { id: number; name: string; count: number }[];
};

export type SearchResponse = {
  data: SearchResult[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
  unknown_places: string[];
  place_names: Record<string, string>;
  unknown_amenities: string[];
  facets: Facets;
};
