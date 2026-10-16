import Image from "next/image";
import type { Deal } from "@/lib/types";

export function Trending({ deals }: { deals: Deal[] }) {
  return (
    <section className="trending" aria-labelledby="trending-title">
      <div className="trending__inner">
        <div className="trending__head">
          <div>
            <p className="eyebrow">Trending · leto 2027</p>
            <h2 id="trending-title">Najtrazenije ovog leta</h2>
            <p className="trending__sub">
              Ponude koje ljudi najvise rezervisu ove nedelje. Klikni na ponudu i prepisacemo je u pretragu, pa je
              doteraj po svom.
            </p>
          </div>
          <span className="trending__note">Cene su ukupne, za navedeni broj osoba.</span>
        </div>
        <ul className="deals">
          {deals.map((deal) => (
            <DealCard key={deal.title} deal={deal} />
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
        <Image src={deal.img} alt={deal.place} fill sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 380px" />
        <span className="deal__tag">{deal.tag}</span>
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
            <small>ukupno, vec od</small>
            {deal.price} EUR
          </div>
          <button className="deal__btn" type="button">
            Zelim ovo
          </button>
        </div>
      </div>
    </li>
  );
}
