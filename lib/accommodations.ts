import "server-only";
import { z } from "zod";
import { laravelFetch, TooManyRequestsError } from "@/lib/laravel";
import type { DealOffer } from "@/lib/ai-search/types";
import type { AccommodationDetail } from "@/lib/types";

const amenitiesResponseSchema = z.object({ data: z.array(z.object({ name: z.string() })) });

export async function getAccommodation(id: string): Promise<AccommodationDetail | null> {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const response = await laravelFetch(`/accommodations/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (response.status === 429) {
    throw new TooManyRequestsError(response);
  }

  if (!response.ok) {
    console.error("Accommodation page: Laravel answered", response.status);
    throw new Error("Smeštaj trenutno ne može da se učita.");
  }

  return ((await response.json()) as { data: AccommodationDetail }).data;
}

export async function getAmenityNames(): Promise<string[]> {
  const response = await laravelFetch("/amenities");

  if (!response.ok) {
    throw new Error(`Laravel answered ${response.status}`);
  }

  return amenitiesResponseSchema.parse(await response.json()).data.map((amenity) => amenity.name);
}

export async function getDeals(): Promise<DealOffer[]> {
  try {
    const response = await laravelFetch("/deals");

    if (!response.ok) {
      console.error("Home page: Laravel answered", response.status);
      return [];
    }

    return ((await response.json()) as { data: DealOffer[] }).data;
  } catch (error) {
    console.error("Home page: deals could not be loaded", error);
    return [];
  }
}
