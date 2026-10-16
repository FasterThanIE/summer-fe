import type { Metadata } from "next";
import { PropertyDetail } from "@/components/detail/property-detail";
import { PROPERTY_DETAIL } from "@/lib/mock-data";

export const metadata: Metadata = { title: `${PROPERTY_DETAIL.property.name} · Sunce putovanja` };

export default function PropertyPage() {
  return (
    <section className="results" aria-labelledby="detail-title">
      <PropertyDetail detail={PROPERTY_DETAIL} backHref="/rezultati" />
    </section>
  );
}
