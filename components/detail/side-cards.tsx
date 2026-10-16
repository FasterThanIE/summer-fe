import type { AgencyStats, Property, Review } from "@/lib/types";
import { Icon } from "../icons";

export function Quote({ review }: { review: Review }) {
  return (
    <blockquote className="quote">
      „{review.text}“<cite>{review.author}</cite>
    </blockquote>
  );
}

export function AgencyCard({ agency }: { agency: AgencyStats }) {
  return (
    <div className="card">
      <p className="card__label">Ponudu organizuje</p>
      <div className="ag">
        <span className="ag__logo" style={{ background: agency.color }}>
          {agency.initials}
        </span>
        <div>
          <p className="ag__name">{agency.name}</p>
          <div className="ag__meta">
            <span className="ag__verified">
              <Icon name="shield" />
              Licencirana agencija
            </span>{" "}
            · {agency.city}
          </div>
        </div>
      </div>
      <div className="ag__stats">
        <div className="ag__stat">
          <b>{agency.score}</b>
          <span>{agency.reviews} ocena</span>
        </div>
        <div className="ag__stat">
          <b>{agency.listings}</b>
          <span>{agency.listings === 1 ? "smestaj" : "smestaja"}</span>
        </div>
        <div className="ag__stat">
          <b>{agency.years}</b>
          <span>godina rada</span>
        </div>
      </div>
      <button className="btn-outline" type="button">
        <Icon name="list" />
        Svi smestaji agencije
      </button>
    </div>
  );
}

export function RatingCard({ property, review }: { property: Property; review: Review }) {
  return (
    <div className="card">
      <p className="card__label">Ocena gostiju</p>
      <div className="rate">
        <div className="rate__num">{property.score.toFixed(1)}</div>
        <div className="rate__txt">
          <b>{property.scoreLabel}</b>
          <span>{property.reviews} recenzija</span>
        </div>
      </div>
      <Quote review={review} />
    </div>
  );
}
