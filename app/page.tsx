import { Hero } from "@/components/home/hero";
import { Trending } from "@/components/home/trending";
import { DEALS, EXAMPLE_QUERIES } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <div className="page">
        <Hero examples={EXAMPLE_QUERIES} />
      </div>
      <Trending deals={DEALS} />
    </>
  );
}
