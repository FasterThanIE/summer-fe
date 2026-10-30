import type { UnitType } from "@/lib/types";
import type {
  BeachBand,
  DestinationFacet,
  EffectiveFilters,
  Importance,
  PlaceFilter,
  SearchFilters,
  SearchParams,
  SearchSort,
  SidebarBudget,
  SidebarDates,
  SidebarState,
} from "./types";
import { withoutDiacritics } from "./plain-text";

export const PARAM = {
  place: "mesto",
  near: "blizu",
  month: "mesec",
  checkIn: "dolazak",
  nights: "noci",
  adults: "odrasli",
  kids: "deca",
  budget: "budzet",
  beach: "plaza",
  amenities: "sadrzaji",
  type: "tip",
  offer: "ponuda",
  discount: "popust",
  agency: "agencija",
  sort: "sortiraj",
  page: "strana",
} as const;

const PARAM_ORDER: string[] = Object.values(PARAM);

export const SIDEBAR_PARAMS: string[] = PARAM_ORDER.filter((name) => name !== PARAM.sort && name !== PARAM.page);

export const SELECTED_PRICE_PARAM = "ponuda";

const PREFIX: Record<Importance, string> = { required: "", preferred: "~", avoided: "~-", excluded: "-" };

export const BEACH_SLUGS: Record<BeachBand, string> = {
  beachfront: "na-plazi",
  near: "blizu",
  short_walk: "par-minuta",
  walk: "do-10-minuta",
  far: "daleko",
};

export const BEACH_LIMITS: Record<BeachBand, [number | null, number | null]> = {
  beachfront: [null, 20],
  near: [null, 100],
  short_walk: [null, 300],
  walk: [null, 700],
  far: [701, null],
};

export const UNIT_TYPE_SLUGS: Record<UnitType, string> = {
  apartment: "apartman",
  studio: "studio",
  duplex: "duplex",
  room: "soba",
  hotel_room: "hotelska-soba",
};

const OFFER_SLUGS = { first_minute: "first-minute", last_minute: "last-minute" } as const;

const SORT_SLUGS: Record<SearchSort, string | null> = { recommended: null, price: "cena", beach: "plaza" };

const DISCOUNT = "da";

type Token = { importance: Importance; value: string };

function slugFor<T extends string>(slugs: Record<T, string | null>, slug: string): T | undefined {
  return (Object.keys(slugs) as T[]).find((key) => slugs[key] === slug);
}

export function readParam(params: SearchParams, name: string): string | undefined {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

function splitToken(token: string): Token {
  if (token.startsWith("~-")) {
    return { importance: "avoided", value: token.slice(2) };
  }

  if (token.startsWith("~")) {
    return { importance: "preferred", value: token.slice(1) };
  }

  return token.startsWith("-") ? { importance: "excluded", value: token.slice(1) } : { importance: "required", value: token };
}

function joinToken(importance: Importance, value: string): string {
  return `${PREFIX[importance]}${value}`;
}

function readTokens(params: SearchParams, name: string): Token[] {
  return (readParam(params, name) ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map(splitToken)
    .filter((token) => token.value !== "");
}

function singleValueImportance(importance: Importance): "required" | "preferred" {
  return importance === "preferred" ? "preferred" : "required";
}

function formatRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) {
    return min === max ? String(min) : `${min}..${max}`;
  }

  return min !== null ? `${min}..` : max !== null ? `..${max}` : null;
}

function parseRange(text: string | undefined): { min: number | null; max: number | null } | null {
  const match = text?.match(/^(\d+)?(\.\.)?(\d+)?$/);

  if (!match || (match[1] === undefined && match[3] === undefined)) {
    return null;
  }

  const min = match[1] === undefined ? null : Number(match[1]);
  const max = match[2] === undefined ? min : match[3] === undefined ? null : Number(match[3]);

  return min !== null && max !== null && min > max ? { min: max, max: min } : { min, max };
}

const isDate = (text: string | undefined): text is string => {
  const time = Date.parse(`${text}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(text ?? "") && !Number.isNaN(time) && new Date(time).toISOString().startsWith(text ?? "");
};

function parseDates(text: string | undefined, today?: string): { from: string | null; to: string | null } | null {
  if (text === undefined) {
    return null;
  }

  const [first, second] = text.includes("..") ? text.split("..") : [text, text];
  let from = isDate(first) ? first : null;
  let to = isDate(second) ? second : null;

  if (from && to && from > to) {
    [from, to] = [to, from];
  }

  if (today && to && to < today) {
    return null;
  }

  if (today && from && from < today) {
    from = today;
  }

  return from || to ? { from, to } : null;
}

function formatDates(from: string | null, to: string | null): string | null {
  if (from && to) {
    return from === to ? from : `${from}..${to}`;
  }

  return from ? `${from}..` : to ? `..${to}` : null;
}

function parseBudget(text: string | undefined): { min_eur: number | null; max_eur: number | null } | null {
  if (text === undefined || text === "") {
    return null;
  }

  const range = text.includes("..") ? parseRange(text) : { min: null, max: Number(text) };
  const positive = (amount: number | null | undefined) => (amount && amount > 0 ? amount : null);
  const budget = { min_eur: positive(range?.min), max_eur: positive(range?.max) };

  return budget.min_eur || budget.max_eur ? budget : null;
}

function formatBudget(minEur: number | null, maxEur: number | null): string | null {
  if (minEur === null) {
    return maxEur === null ? null : String(maxEur);
  }

  return `${minEur}..${maxEur ?? ""}`;
}

export function paramsFromFilters(filters: SearchFilters): Record<string, string> {
  const params: Record<string, string> = {};
  const set = (name: string, value: string | null | undefined) => {
    if (value) {
      params[name] = value;
    }
  };
  const list = (tokens: string[]) => tokens.join(",");
  const places = filters.places ?? [];

  set(PARAM.place, list(places.filter((place) => !place.near).map((place) => joinToken(place.importance, place.name))));
  set(
    PARAM.near,
    list(
      places
        .filter((place) => place.near)
        .map((place) => joinToken(place.importance, place.radius_km ? `${place.name}:${place.radius_km}` : place.name)),
    ),
  );
  set(PARAM.month, list((filters.months ?? []).map((month) => joinToken(month.importance, String(month.value)))));

  if (filters.check_in) {
    const { from, to, importance } = filters.check_in;
    set(PARAM.checkIn, joinToken(importance, from === to ? from : `${from}..${to}`));
  }

  if (filters.nights) {
    const range = formatRange(filters.nights.min, filters.nights.max);
    set(PARAM.nights, range && joinToken(filters.nights.importance, range));
  }

  if (filters.adults) {
    set(PARAM.adults, formatRange(filters.adults.min, filters.adults.max));
  }

  if (filters.kids && (filters.kids.max ?? filters.kids.min) > 0) {
    set(PARAM.kids, formatRange(filters.kids.min, filters.kids.max));
  }

  if (filters.budget) {
    const { min_eur, max_eur, per, importance } = filters.budget;
    const amount = formatBudget(min_eur, max_eur);
    set(PARAM.budget, amount && joinToken(importance, `${amount}${per === "night" ? "/noc" : ""}`));
  }

  if (filters.beach) {
    const { band, min_meters, max_meters, importance } = filters.beach;
    const value =
      band && min_meters === null && max_meters === null
        ? BEACH_SLUGS[band]
        : formatRange(min_meters ?? (band ? BEACH_LIMITS[band][0] : null), max_meters ?? (band ? BEACH_LIMITS[band][1] : null));
    set(PARAM.beach, value && joinToken(importance, value));
  }

  set(PARAM.amenities, list((filters.amenities ?? []).map((amenity) => joinToken(amenity.importance, amenity.name))));
  set(PARAM.type, list((filters.unit_types ?? []).map((type) => joinToken(type.importance, UNIT_TYPE_SLUGS[type.value]))));

  if (filters.special_offer) {
    set(PARAM.offer, joinToken(filters.special_offer.importance, OFFER_SLUGS[filters.special_offer.value]));
  }

  if (filters.has_discount) {
    set(PARAM.discount, joinToken(filters.has_discount.importance, DISCOUNT));
  }

  return params;
}

export function filtersFromParams(params: SearchParams, today?: string): EffectiveFilters {
  const places: PlaceFilter[] = [
    ...readTokens(params, PARAM.place).map(({ importance, value }): PlaceFilter => {
      const [name, within] = value.split("/");
      return within
        ? { name, type: "city", within, near: false, radius_km: null, importance }
        : { name, type: "region", near: false, radius_km: null, importance };
    }),
    ...readTokens(params, PARAM.near).map(({ importance, value }): PlaceFilter => {
      const [name, km] = value.split(":");
      const radius = Number(km);
      return { name, type: "city", near: true, radius_km: radius > 0 ? radius : null, importance };
    }),
  ];

  const months = readTokens(params, PARAM.month)
    .map(({ importance, value }) => ({ value: Number(value), importance }))
    .filter((month) => Number.isInteger(month.value) && month.value >= 1 && month.value <= 12);

  const [checkIn] = readTokens(params, PARAM.checkIn);
  const checkInDates = parseDates(checkIn?.value, today);

  const [nightsToken] = readTokens(params, PARAM.nights);
  const nights = parseRange(nightsToken?.value);
  const adults = parseRange(readParam(params, PARAM.adults));
  const kids = parseRange(readParam(params, PARAM.kids));

  const [budgetToken] = readTokens(params, PARAM.budget);
  const [budgetAmount, budgetPeriod] = budgetToken?.value.split("/") ?? [];
  const budget = parseBudget(budgetAmount);

  const [beachToken] = readTokens(params, PARAM.beach);
  const band = beachToken ? slugFor(BEACH_SLUGS, beachToken.value) : undefined;
  const beachMeters = band ? null : parseRange(beachToken?.value);

  const amenities = readTokens(params, PARAM.amenities).map(({ importance, value }) => ({ name: value, importance }));
  const unitTypes = readTokens(params, PARAM.type).flatMap(({ importance, value }) => {
    const type = slugFor(UNIT_TYPE_SLUGS, value);
    return type ? [{ value: type, importance }] : [];
  });

  const [offerToken] = readTokens(params, PARAM.offer);
  const offer = offerToken ? slugFor(OFFER_SLUGS, offerToken.value) : undefined;
  const [discountToken] = readTokens(params, PARAM.discount);

  const agencies = (readParam(params, PARAM.agency) ?? "").split(",").map((name) => name.trim()).filter(Boolean);

  return {
    places: places.length > 0 ? places : null,
    months: months.length > 0 ? months : null,
    check_in: checkIn && checkInDates ? { ...checkInDates, importance: singleValueImportance(checkIn.importance) } : null,
    nights: nightsToken && nights ? { ...nights, importance: singleValueImportance(nightsToken.importance) } : null,
    adults: adults?.min ? { min: adults.min, max: adults.max } : null,
    kids: kids?.min !== null && kids?.min !== undefined ? { min: kids.min, max: kids.max } : null,
    budget:
      budgetToken && budget
        ? { ...budget, per: budgetPeriod === "noc" ? "night" : "stay", importance: singleValueImportance(budgetToken.importance) }
        : null,
    beach:
      beachToken && (band || beachMeters)
        ? {
            band: band ?? null,
            min_meters: beachMeters?.min ?? null,
            max_meters: beachMeters?.max ?? null,
            importance: singleValueImportance(beachToken.importance),
          }
        : null,
    amenities: amenities.length > 0 ? amenities : null,
    unit_types: unitTypes.length > 0 ? unitTypes : null,
    special_offer: offerToken && offer ? { value: offer, importance: singleValueImportance(offerToken.importance) } : null,
    has_discount: discountToken?.value === DISCOUNT ? { importance: singleValueImportance(discountToken.importance) } : null,
    agencies: agencies.length > 0 ? agencies : null,
  };
}

export function readPage(params: SearchParams): number {
  const page = Number.parseInt(readParam(params, PARAM.page) ?? "1", 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function readSort(params: SearchParams): SearchSort {
  return slugFor(SORT_SLUGS, readParam(params, PARAM.sort) ?? "") ?? "recommended";
}

export function sortParam(sort: SearchSort): string | null {
  return SORT_SLUGS[sort];
}

export function flattenParams(params: SearchParams): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params).flatMap(([name, value]) => {
      const first = Array.isArray(value) ? value[0] : value;
      return first === undefined || first === "" ? [] : [[name, first]];
    }),
  );
}

function encodeValue(value: string): string {
  return encodeURIComponent(value)
    .replace(/%2C/gi, ",")
    .replace(/%2F/gi, "/")
    .replace(/%3A/gi, ":")
    .replace(/%20/g, "+");
}

export function resultsHref(params: Record<string, string>): string {
  const rank = (name: string) => (PARAM_ORDER.includes(name) ? PARAM_ORDER.indexOf(name) : PARAM_ORDER.length);
  const query = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([first], [second]) => rank(first) - rank(second))
    .map(([name, value]) => `${name}=${encodeValue(value)}`)
    .join("&");

  return query ? `/rezultati?${query}` : "/rezultati";
}

export function offerHref(accommodationId: number, priceId: number): string {
  return `/smestaj/${accommodationId}?${SELECTED_PRICE_PARAM}=${priceId}`;
}

export function budgetParam(budget: SidebarBudget): string | null {
  const amount = formatBudget(budget.minEur, budget.maxEur);
  return amount === null ? null : `${amount}${budget.perNight ? "/noc" : ""}`;
}

export function checkInParam(dates: SidebarDates): string | null {
  return formatDates(dates.from, dates.to);
}

function sameName(first: string, second: string): boolean {
  return withoutDiacritics(first).toLowerCase() === withoutDiacritics(second).toLowerCase();
}

function requiredValues(params: SearchParams, name: string): string[] {
  return readTokens(params, name)
    .filter((token) => token.importance === "required")
    .map((token) => token.value);
}

export function sidebarState(params: SearchParams, destinations: DestinationFacet[], today?: string): SidebarState {
  const nights = parseRange(readTokens(params, PARAM.nights)[0]?.value);
  const [beachToken] = readTokens(params, PARAM.beach);
  const [offerToken] = readTokens(params, PARAM.offer);
  const [discountToken] = readTokens(params, PARAM.discount);
  const offer = offerToken?.importance === "required" ? slugFor(OFFER_SLUGS, offerToken.value) : undefined;
  const [budgetAmount, budgetPeriod] = (readTokens(params, PARAM.budget)[0]?.value ?? "").split("/");
  const budget = parseBudget(budgetAmount);
  const checkIn = parseDates(readTokens(params, PARAM.checkIn)[0]?.value, today);

  return {
    places: requiredValues(params, PARAM.place).flatMap((value) => {
      if (value.includes("/")) {
        return [value];
      }

      const area = destinations.find((destination) => sameName(destination.name, value));
      return area
        ? [area.name]
        : destinations.flatMap((destination) =>
            destination.cities.filter((city) => sameName(city.name, value)).map((city) => `${city.name}/${destination.name}`),
          );
    }),
    nights: nights && nights.min === nights.max ? nights.min : null,
    adults: parseRange(readParam(params, PARAM.adults))?.min ?? 2,
    kids: parseRange(readParam(params, PARAM.kids))?.min ?? 0,
    checkIn: { from: checkIn?.from ?? null, to: checkIn?.to ?? null },
    budget: { minEur: budget?.min_eur ?? null, maxEur: budget?.max_eur ?? null, perNight: budgetPeriod === "noc" },
    beach: beachToken?.importance === "required" ? (slugFor(BEACH_SLUGS, beachToken.value) ?? null) : null,
    amenities: requiredValues(params, PARAM.amenities),
    types: requiredValues(params, PARAM.type).flatMap((slug) => slugFor(UNIT_TYPE_SLUGS, slug) ?? []),
    offers: [...(offer ? [offer] : []), ...(discountToken?.importance === "required" ? ["discount"] : [])],
    agencies: (readParam(params, PARAM.agency) ?? "").split(",").filter(Boolean),
  };
}

export function withRequired(current: string | undefined, required: string[]): string | null {
  const kept = (current ?? "")
    .split(",")
    .filter(Boolean)
    .filter((token) => {
      const { importance, value } = splitToken(token);
      return importance !== "required" && !required.includes(value);
    });
  const tokens = [...required, ...kept];

  return tokens.length > 0 ? tokens.join(",") : null;
}

export function offerParams(current: Record<string, string>, offers: string[]): Record<string, string | null> {
  const keepWish = (name: string) => {
    const token = current[name];
    return token && splitToken(token).importance !== "required" ? token : null;
  };
  const specialOffer = offers.find((offer): offer is keyof typeof OFFER_SLUGS => offer in OFFER_SLUGS);

  return {
    [PARAM.offer]: specialOffer ? OFFER_SLUGS[specialOffer] : keepWish(PARAM.offer),
    [PARAM.discount]: offers.includes("discount") ? DISCOUNT : keepWish(PARAM.discount),
  };
}
