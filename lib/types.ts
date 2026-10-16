import type { IconName } from "@/components/icons";

export type Property = {
  slug: string;
  name: string;
  img: string;
  stars: number;
  place: string;
  city: string;
  region: string;
  typeLabel: string;
  beach: string;
  cap: number;
  amenities: { icon: IconName; label: string }[];
  room: string;
  beds: string;
  agency: Agency;
  offer: string | null;
  inBudget: boolean;
  discount: string | null;
  score: number;
  scoreLabel: string;
  reviews: string;
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
  img: string;
  place: string;
  title: string;
  meta: string[];
  price: string;
  tag: string;
};

export type DestinationRegion = {
  region: string;
  count: number;
  checked: boolean;
  open: boolean;
  cities: { name: string; count: number; checked: boolean }[];
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

export type PriceCell = { price: number; promo?: boolean; cheapest?: boolean; selected?: boolean } | null;

export type PriceRow = { label: string; aux: string; paying: number; cells: PriceCell[] };

export type PriceTable = {
  heading: string;
  periods: { from: string; to: string }[];
  selectedColumn: number;
  selectedRow: number;
  rows: PriceRow[];
};

export type PriceSummary = {
  term: string;
  nights: string;
  lines: [string, string][];
  total: string;
  oldTotal: string | null;
  totalFor: string;
  note: string;
};

export type AgencyStats = Agency & {
  city: string;
  score: string;
  reviews: string;
  listings: number;
  years: number;
};

export type Review = { text: string; author: string };

export type PropertyDetail = {
  property: Property;
  photos: string[];
  agency: AgencyStats;
  description: string[];
  highlights: { icon: IconName; title: string; sub: string }[];
  amenities: { icon: IconName; label: string; available: boolean }[];
  unitTags: string[];
  nearby: [string, string][];
  subscores: [string, number][];
  reviews: [Review, Review];
  rules: [string, string][];
  packageLabel: string;
  included: string;
  excluded: string;
  priceTable: PriceTable;
  priceSummary: PriceSummary;
};
