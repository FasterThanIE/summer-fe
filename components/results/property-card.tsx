import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { Icon } from "../icons";
import { Stars } from "../stars";

type PropertyCardProps = {
  property: Property;
  href: string;
  index?: number;
  isTop?: boolean;
  isFavorite?: boolean;
};

export function PropertyCard({ property: p, href, index = 0, isTop = false, isFavorite = false }: PropertyCardProps) {
  return (
    <li className={`prop${isTop ? " prop--top" : ""}`} style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}>
      <div className="prop__pic">
        <Image
          src={p.img}
          alt={`${p.place}, ${p.region}`}
          fill
          sizes="(max-width: 600px) 100vw, 300px"
          loading={index < 3 ? "eager" : "lazy"}
        />
        {isTop && <span className="pic-tag">Najbolji izbor</span>}
        {p.discount && <span className="pic-off">{p.discount}</span>}
        <span className="pic-place">
          <Icon name="pin" />
          {p.place}
        </span>
        <button
          className="fav"
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Ukloni iz omiljenih" : "Sacuvaj u omiljene"}
        >
          <Icon name={isFavorite ? "heart" : "heartOutline"} />
        </button>
      </div>

      <div className="prop__body">
        <div className="prop__main">
          <div>
            <h3 className="prop__name">
              <Link className="prop__name-btn" href={href}>
                {p.name}
              </Link>
            </h3>
            <div className="prop__meta">
              <span className="type-pill">{p.typeLabel}</span>
              <Stars count={p.stars} />
              <span className="dot" />
              <span>{p.region}</span>
              <span className="dot" />
              <span>do {p.cap} osoba</span>
            </div>
          </div>
          <ul className="amen">
            <li>
              <Icon name="beach" />
              {p.beach} od plaze
            </li>
            {p.amenities.map((a) => (
              <li key={a.label}>
                <Icon name={a.icon} />
                {a.label}
              </li>
            ))}
          </ul>
          <div className="prop__room">
            <strong>{p.room}</strong>
            {p.beds}
          </div>
          <div className="tags">
            <span className="agency">
              <span className="agency__dot" style={{ background: p.agency.color }}>
                {p.agency.initials}
              </span>
              {p.agency.name}
            </span>
            {p.offer && (
              <span className="tag-deal">
                <Icon name="bolt" />
                {p.offer}
              </span>
            )}
            {p.inBudget && (
              <span className="tag-ok">
                <Icon name="check" />U okviru budzeta
              </span>
            )}
          </div>
        </div>

        <div className="prop__side">
          <div className="score">
            <div className="score__text">
              {p.scoreLabel}
              <small>{p.reviews} recenzija</small>
            </div>
            <div className="score__num">{p.score.toFixed(1)}</div>
          </div>
          <div className="price">
            <div className="price__for">{p.priceFor}</div>
            {p.oldTotal && <div className="price__old">{p.oldTotal} EUR</div>}
            <div className="price__now">
              {p.total}
              <small>EUR</small>
            </div>
            <div className="price__pn">{p.perNight} EUR po noci · sve takse</div>
          </div>
          <Link className="prop__cta" href={href}>
            Pogledaj ponudu <Icon name="arrowRight" />
          </Link>
        </div>
      </div>
    </li>
  );
}
