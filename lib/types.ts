import type { IconName } from "@/components/icons";

export type ThemeMode = "light" | "dark";

export type UnitType = "apartment" | "studio" | "duplex" | "room" | "hotel_room";

export type SpecialOffer = "first_minute" | "last_minute";

export type Price = {
  id: number;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: string;
  discounted_total_price: string | null;
  special_offer: SpecialOffer | null;
};

export type Unit = {
  id: number;
  name: string;
  type: UnitType;
  max_guests: number;
  beds: string | null;
};

export type DetailUnit = Unit & { prices: Price[] };

export type AccommodationDetail = {
  id: number;
  name: string;
  stars: number | null;
  description: string | null;
  source_url: string | null;
  beach_distance_m: number | null;
  latitude: string | null;
  longitude: string | null;
  city: { id: number; name: string };
  regions: string[];
  agency: { id: number; name: string; city: string; accommodations_count: number };
  photos: string[];
  amenities: string[];
  units: DetailUnit[];
};

export type PropertyCardData = {
  slug: string;
  name: string;
  img: string | null;
  stars: number | null;
  place: string;
  city: string;
  region: string;
  typeLabel: string;
  beach: string | null;
  cap: number;
  amenities: { icon: IconName; label: string }[];
  room: string;
  beds: string | null;
  agency: Agency;
  offer: string | null;
  inBudget: boolean;
  discount: string | null;
  score: number | null;
  scoreLabel: string | null;
  reviews: string | null;
  priceFor: string;
  oldTotal: string | null;
  total: string;
  perNight: string;
};

export type Agency = {
  name: string;
  initials: string;
  color: string;
};

export type Deal = {
  img: string | null;
  place: string;
  title: string;
  meta: string[];
  price: string;
  tag: string | null;
  href: string;
};

export type FilterOption = {
  value: string;
  label: string;
  sub?: string;
  icon?: IconName;
  logo?: { text: string; color: string };
  count: number;
  checked?: boolean;
};

export type FilterSection = {
  name: string;
  legend: string;
  options: FilterOption[];
};

export type SummaryChip = { icon: IconName; label: string };

export type SavedSearch = { name: string; summary: string };
