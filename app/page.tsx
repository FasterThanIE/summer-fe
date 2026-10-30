import { connection } from "next/server";
import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { Trending } from "@/components/home/trending";
import { getDeals } from "@/lib/accommodations";
import { toDealCard } from "@/lib/ai-search/present";

export default function HomePage() {
  return (
    <>
      <div className="page">
        <Hero />
      </div>
      <Suspense fallback={null}>
        <Deals />
      </Suspense>
    </>
  );
}

async function Deals() {
  await connection();
  const deals = await getDeals();

  if (deals.length === 0) {
    return null;
  }

  return <Trending deals={deals.map(toDealCard)} />;
}
