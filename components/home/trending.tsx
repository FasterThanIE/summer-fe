import Link from "next/link";
import type { Deal } from "@/lib/types";
import { AccommodationPhoto } from "../accommodation-photo";

export function Trending({ deals }: { deals: Deal[] }) {
  return (
    <section className="trending" aria-labelledby="trending-title">
      <div className="trending__inner">
        <div className="trending__head">
          <div>
            <p className="eyebrow">Najniže cene</p>
            <h2 id="trending-title">Najpovoljnije ponude</h2>
            <p className="trending__sub">
              Najjeftinija ponuda iz svake destinacije, za termine koji tek dolaze. Klikni na ponudu i pogledaj detalje.
            </p>
          </div>
          <span className="trending__note">Cene su ukupne, za ceo boravak.</span>
        </div>
        <ul className="deals">
          {deals.map((deal) => (
            <DealCard key={deal.href} deal={deal} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <li className="deal">
      <div className="deal__pic">
        <AccommodationPhoto src={deal.img} alt={deal.place} />
        {deal.tag && <span className="deal__tag">{deal.tag}</span>}
        <span className="deal__place">{deal.place}</span>
      </div>
      <div className="deal__body">
        <h3 className="deal__title">{deal.title}</h3>
        <ul className="deal__meta">
          {deal.meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <div className="deal__foot">
          <div className="deal__price">
            <small>ukupno</small>
            {deal.price} EUR
          </div>
          <Link className="deal__btn" href={deal.href}>
            Pogledaj ponudu
          </Link>
        </div>
      </div>
    </li>
  );
}
