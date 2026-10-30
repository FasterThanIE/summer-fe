import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PropertyDetail } from "@/components/detail/property-detail";
import { getAccommodation, getAmenityNames } from "@/lib/accommodations";
import type { SearchParams } from "@/lib/ai-search/types";
import { SELECTED_PRICE_PARAM, readParam } from "@/lib/ai-search/url-filters";
import { TooManyRequestsError } from "@/lib/laravel";

type AccommodationPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: AccommodationPageProps): Promise<Metadata> {
  const accommodation = await getAccommodation((await params).id).catch(() => null);

  return { title: `${accommodation?.name ?? "Smeštaj"} · Sunce putovanja` };
}

export default function AccommodationPage(props: AccommodationPageProps) {
  return (
    <section className="results" aria-labelledby="detail-title">
      <Suspense
        fallback={
          <p className="results__status" role="status">
            Učitavamo smeštaj…
          </p>
        }
      >
        <Accommodation {...props} />
      </Suspense>
    </section>
  );
}

async function Accommodation({ params, searchParams }: AccommodationPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  let accommodation, allAmenities;
  try {
    [accommodation, allAmenities] = await Promise.all([
      getAccommodation(id),
      getAmenityNames().catch((error) => {
        console.error("Accommodation page: amenities could not be loaded", error);
        return [];
      }),
    ]);
  } catch (error) {
    return (
      <p className="results__status" role="alert">
        {error instanceof TooManyRequestsError ? error.message : "Smeštaj trenutno ne može da se učita. Pokušaj ponovo za par trenutaka."}
      </p>
    );
  }

  if (accommodation === null) {
    notFound();
  }

  const selectedPriceId = Number.parseInt(readParam(query, SELECTED_PRICE_PARAM) ?? "", 10);

  return (
    <PropertyDetail
      accommodation={accommodation}
      allAmenities={allAmenities}
      selectedPriceId={Number.isInteger(selectedPriceId) ? selectedPriceId : null}
    />
  );
}
