import type { Price } from "@/lib/types";

export function paidPrice(price: Price): number {
  return Number(price.discounted_total_price ?? price.total_price);
}

export function hasDiscount(price: Price): boolean {
  return price.discounted_total_price !== null && paidPrice(price) < Number(price.total_price);
}

export const SPECIAL_OFFER_LABELS = { first_minute: "First minute", last_minute: "Last minute" } as const;
