import type { IconName } from "@/components/icons";
import { SPECIAL_OFFER_LABELS, paidPrice } from "@/lib/offers";
import type { Agency, Deal, FilterSection, PropertyCardData, SummaryChip, UnitType } from "@/lib/types";
import type { AiError, AiNotice, BeachBand, DealOffer, EffectiveFilters, Facets, Importance, SearchResult } from "./types";
import { offerHref } from "./url-filters";

const AGENCY_COLORS = ["#f2b600", "#1f7fc4", "#e0663a", "#1a9e8f", "#8a5cd1", "#d1477a"];

const MONTHS = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];

export const UNIT_TYPE_LABELS: Record<UnitType, { label: string; sub: string; icon: IconName }> = {
  apartment: { label: "Apartman", sub: "odvojena spavaća soba", icon: "apartment" },
  studio: { label: "Studio", sub: "jedna prostorija sa kuhinjom", icon: "studio" },
  duplex: { label: "Duplex", sub: "smeštaj na dva nivoa", icon: "duplex" },
  room: { label: "Soba", sub: "soba u kući ili vili", icon: "bed" },
  hotel_room: { label: "Hotelska soba", sub: "soba u hotelu", icon: "bed" },
};

const BEACH_LABELS: Record<BeachBand, { label: string; sub: string; icon: IconName }> = {
  beachfront: { label: "Na samoj plaži", sub: "do 20 m", icon: "beach" },
  near: { label: "Blizu plaže", sub: "do 100 m", icon: "beach" },
  short_walk: { label: "Par minuta peške", sub: "do 300 m", icon: "walk" },
  walk: { label: "Do 10 minuta peške", sub: "do 700 m", icon: "walk" },
  far: { label: "Dalje od plaže", sub: "više od 700 m", icon: "car" },
};

export const AMENITY_ICONS: Record<string, IconName> = {
  Bazen: "pool",
  "Sopstvena plaža": "beach",
  Klima: "ac",
  WiFi: "wifi",
  "Besplatan parking": "parking",
  Kuhinja: "kitchen",
  "Terasa ili balkon": "sun",
  TV: "tv",
  "Čišćenje svaka 3 dana": "sparkle",
  "Posteljina i peškiri": "bed",
  "Mirna lokacija": "moon",
  "Blizu aerodroma": "pin",
};

const euros = new Intl.NumberFormat("sr-Latn-RS", { maximumFractionDigits: 0 });

export function formatEuros(amount: number): string {
  return euros.format(Math.round(amount));
}

export function countWord(count: number, one: string, few: string, many: string): string {
  const lastTwo = count % 100;
  const last = count % 10;

  if (last === 1 && lastTwo !== 11) {
    return one;
  }

  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}

function rangeLabel(range: { min: number; max: number | null }, one: string, few: string, many: string): string {
  if (range.max === null) {
    return `najmanje ${range.min} ${countWord(range.min, one, few, many)}`;
  }

  return range.min === range.max
    ? `${range.min} ${countWord(range.min, one, few, many)}`
    : `${range.min}–${range.max} ${countWord(range.max, one, few, many)}`;
}

function peopleLabel(filters: EffectiveFilters): string | null {
  const parts = [
    filters.adults ? rangeLabel(filters.adults, "odrasla osoba", "odrasla", "odraslih") : null,
    filters.kids && (filters.kids.max ?? filters.kids.min) > 0 ? rangeLabel(filters.kids, "dete", "deteta", "dece") : null,
  ].filter((part) => part !== null);

  return parts.length > 0 ? parts.join(", ") : null;
}

function withImportance(label: string, importance: Importance): string {
  switch (importance) {
    case "preferred":
      return `${label} (poželjno)`;
    case "avoided":
      return `radije bez: ${label}`;
    case "excluded":
      return `bez: ${label}`;
    default:
      return label;
  }
}

export function shortDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${day}.${month}.`;
}

function placeName(place: { name: string; within?: string }, placeNames: Record<string, string>): string {
  const name = placeNames[place.name] ?? place.name;
  return place.within ? `${name} (${place.within})` : name;
}

export function summaryChips(filters: EffectiveFilters, placeNames: Record<string, string>): SummaryChip[] {
  const chips: SummaryChip[] = [];

  for (const place of filters.places ?? []) {
    const name = placeName(place, placeNames);
    const label = place.near ? `blizu ${name}${place.radius_km ? ` (${place.radius_km} km)` : ""}` : name;
    chips.push({ icon: "pin", label: withImportance(label, place.importance) });
  }

  for (const month of filters.months ?? []) {
    chips.push({ icon: "calendar", label: withImportance(MONTHS[month.value - 1] ?? `${month.value}. mesec`, month.importance) });
  }

  if (filters.check_in) {
    const { from, to, importance } = filters.check_in;
    const label =
      from && to
        ? from === to
          ? `dolazak ${shortDate(from)}`
          : `dolazak ${shortDate(from)} – ${shortDate(to)}`
        : from
          ? `dolazak od ${shortDate(from)}`
          : `dolazak do ${shortDate(to ?? "")}`;
    chips.push({ icon: "calendar", label: withImportance(label, importance) });
  }

  if (filters.nights && (filters.nights.min !== null || filters.nights.max !== null)) {
    const { min, max, importance } = filters.nights;
    const label =
      min !== null && max !== null
        ? min === max
          ? `${min} noći`
          : `${min}–${max} noći`
        : min !== null
          ? `od ${min} noći`
          : `do ${max} noći`;
    chips.push({ icon: "moon", label: withImportance(label, importance) });
  }

  const people = peopleLabel(filters);
  if (people) {
    chips.push({ icon: "users", label: people });
  }

  if (filters.budget) {
    const { min_eur, max_eur, per, importance } = filters.budget;
    const amount =
      min_eur !== null && max_eur !== null
        ? `${formatEuros(min_eur)}–${formatEuros(max_eur)} EUR`
        : min_eur !== null
          ? `od ${formatEuros(min_eur)} EUR`
          : `do ${formatEuros(max_eur ?? 0)} EUR`;
    chips.push({ icon: "wallet", label: withImportance(`${amount}${per === "night" ? " po noći" : ""}`, importance) });
  }

  if (filters.beach) {
    const { band, min_meters, max_meters, importance } = filters.beach;
    const min = min_meters ?? (band === "far" ? 701 : null);
    const max = max_meters ?? (band && band !== "far" ? { beachfront: 20, near: 100, short_walk: 300, walk: 700 }[band] : null);
    const label =
      min !== null && max !== null
        ? `${min}–${max} m od plaže`
        : min !== null
          ? `više od ${min - 1} m od plaže`
          : max !== null
            ? `do ${max} m od plaže`
            : null;

    if (label) {
      chips.push({ icon: "beach", label: withImportance(label, importance) });
    }
  }

  for (const amenity of filters.amenities ?? []) {
    chips.push({ icon: AMENITY_ICONS[amenity.name] ?? "check", label: withImportance(amenity.name, amenity.importance) });
  }

  for (const unitType of filters.unit_types ?? []) {
    const { label, icon } = UNIT_TYPE_LABELS[unitType.value];
    chips.push({ icon, label: withImportance(label, unitType.importance) });
  }

  if (filters.special_offer) {
    chips.push({ icon: "clock", label: withImportance(SPECIAL_OFFER_LABELS[filters.special_offer.value], filters.special_offer.importance) });
  }

  if (filters.has_discount) {
    chips.push({ icon: "tag", label: withImportance("Popust", filters.has_discount.importance) });
  }

  for (const agency of filters.agencies ?? []) {
    chips.push({ icon: "shield", label: agency });
  }

  return chips;
}

const FIELD_LABELS: Record<string, string> = {
  places: "mesto",
  months: "mesec",
  check_in: "dolazak",
  nights: "broj noći",
  adults: "broj odraslih",
  kids: "broj dece",
  budget: "budžet",
  beach: "udaljenost od plaže",
  amenities: "sadržaji",
  unit_types: "tip smeštaja",
  special_offer: "ponuda",
  has_discount: "popust",
};

export function aiErrorText(error: AiError): string {
  const label = FIELD_LABELS[error.field];
  return `Nismo razumeli „${error.value}“${label ? ` (${label})` : ""}.`;
}

export function aiNoticeText(notice: AiNotice): string {
  return notice.kind === "other_currency"
    ? `Budžet „${notice.wish}“ ne možemo da koristimo, upiši iznos u evrima.`
    : `Za „${notice.wish}“ još nemamo filter, pa to nije uključeno u pretragu.`;
}

export function resultsTitle(filters: EffectiveFilters, placeNames: Record<string, string>): string {
  const wanted = (filters.places ?? [])
    .filter((place) => place.importance === "required")
    .map((place) => placeName(place, placeNames));
  return wanted.length > 0 ? wanted.join(", ") : "Svi smeštaji";
}

export function agencyBadge(agency: { id: number; name: string }): Agency {
  const initials = agency.name
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return { name: agency.name, initials, color: AGENCY_COLORS[agency.id % AGENCY_COLORS.length] };
}

function isInBudget(price: number, nights: number, filters: EffectiveFilters): boolean {
  if (!filters.budget) {
    return false;
  }

  const amount = filters.budget.per === "night" ? price / nights : price;
  return amount >= (filters.budget.min_eur ?? 0) && amount <= (filters.budget.max_eur ?? Number.POSITIVE_INFINITY);
}

export function toPropertyCard(result: SearchResult, filters: EffectiveFilters): PropertyCardData {
  const { accommodation, unit, price } = result;
  const total = Number(price.total_price);
  const paid = paidPrice(price);
  const regions =[...new Set(accommodation.regions.slice(0, 2))];
  const people = peopleLabel(filters) ?? `do ${unit.max_guests} ${countWord(unit.max_guests, "osobe", "osobe", "osoba")}`;

  return {
    slug: String(accommodation.id),
    name: accommodation.name,
    img: accommodation.photo,
    stars: accommodation.stars,
    place: accommodation.city.name,
    city: accommodation.city.name,
    region: regions.join(", "),
    typeLabel: UNIT_TYPE_LABELS[unit.type].label,
    beach: accommodation.beach_distance_m === null ? null : `${formatEuros(accommodation.beach_distance_m)} m`,
    cap: unit.max_guests,
    amenities: Object.entries(AMENITY_ICONS)
      .filter(([name]) => accommodation.amenities.includes(name))
      .slice(0, 4)
      .map(([label, icon]) => ({ icon, label })),
    room: unit.name,
    beds: unit.beds,
    agency: agencyBadge(accommodation.agency),
    offer: price.special_offer === null ? null : SPECIAL_OFFER_LABELS[price.special_offer],
    inBudget: isInBudget(paid, price.nights, filters),
    discount: paid < total ? `-${Math.round((1 - paid / total) * 100)}%` : null,
    score: null,
    scoreLabel: null,
    reviews: null,
    priceFor: `${price.nights} noći · ${people} · od ${shortDate(price.check_in)}`,
    oldTotal: paid < total ? formatEuros(total) : null,
    total: formatEuros(paid),
    perNight: formatEuros(paid / price.nights),
  };
}

export function toDealCard({ destination, accommodation, unit, price }: DealOffer): Deal {
  const total = Number(price.total_price);
  const paid = paidPrice(price);
  const discount =paid < total ? `-${Math.round((1 - paid / total) * 100)}%` : null;

  return {
    img: accommodation.photo,
    place: [...new Set([destination, accommodation.city.name])].join(" · "),
    title: accommodation.name,
    meta: [
      `${price.nights} ${countWord(price.nights, "noć", "noći", "noći")}`,
      `${shortDate(price.check_in)} – ${shortDate(price.check_out)}`,
      `do ${unit.max_guests} ${countWord(unit.max_guests, "osobe", "osobe", "osoba")}`,
      UNIT_TYPE_LABELS[unit.type].label,
    ],
    price: formatEuros(paid),
    tag: price.special_offer === null ? discount : SPECIAL_OFFER_LABELS[price.special_offer],
    href: offerHref(accommodation.id, price.id),
  };
}

export function filterSections(facets: Facets): Record<"beach" | "amenities" | "types" | "offers" | "agencies", FilterSection> {
  return {
    beach: {
      name: "beach",
      legend: "Udaljenost od plaže",
      options: (Object.keys(BEACH_LABELS) as BeachBand[]).map((band) => ({ value: band, ...BEACH_LABELS[band], count: facets.beach[band] })),
    },
    amenities: {
      name: "amenities",
      legend: "Sadržaji",
      options: Object.entries(facets.amenities).map(([name, count]) => ({ value: name, label: name, icon: AMENITY_ICONS[name] ?? "check", count })),
    },
    types: {
      name: "types",
      legend: "Tip smeštaja",
      options: (Object.keys(UNIT_TYPE_LABELS) as UnitType[]).map((type) => ({ value: type, ...UNIT_TYPE_LABELS[type], count: facets.unit_types[type] })),
    },
    offers: {
      name: "offers",
      legend: "Ponude",
      options: [
        { value: "first_minute", label: SPECIAL_OFFER_LABELS.first_minute, sub: "rana rezervacija", icon: "clock", count: facets.offers.first_minute },
        { value: "last_minute", label: SPECIAL_OFFER_LABELS.last_minute, sub: "polasci uskoro", icon: "boltOutline", count: facets.offers.last_minute },
        { value: "discount", label: "Popust", sub: "snižena cena", icon: "tag", count: facets.offers.discount },
      ],
    },
    agencies: {
      name: "agencies",
      legend: "Agencije",
      options: facets.agencies.map((agency) => {
        const badge = agencyBadge(agency);
        return { value: agency.name, label: agency.name, logo: { text: badge.initials, color: badge.color }, count: agency.count };
      }),
    },
  };
}
