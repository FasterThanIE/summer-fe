import { countWord, formatEuros, shortDate } from "@/lib/ai-search/present";
import { SPECIAL_OFFER_LABELS, hasDiscount, paidPrice } from "@/lib/offers";
import type { DetailUnit, Price } from "@/lib/types";
import { Icon } from "../icons";

export function PriceBox({ offer }: { offer: { unit: DetailUnit; price: Price } | null }) {
  if (!offer) {
    return (
      <div className="card pricebox">
        <p className="card__label">Izabrani termin</p>
        <p className="unavailable-note">Trenutno nema slobodnih termina.</p>
      </div>
    );
  }

  const { unit, price } = offer;
  const lines: [string, string][] = [
    ["Smeštaj", unit.name],
    ["Kapacitet", `do ${unit.max_guests} ${countWord(unit.max_guests, "osobe", "osobe", "osoba")}`],
    ...(price.special_offer ? [["Ponuda", SPECIAL_OFFER_LABELS[price.special_offer]] as [string, string]] : []),
  ];

  return (
    <div className="card pricebox">
      <p className="card__label">Izabrani termin</p>
      <div className="pb__term">
        <b>
          {shortDate(price.check_in)} – {shortDate(price.check_out)}
        </b>
        <span>{price.nights} noći</span>
      </div>
      <ul className="pb__lines">
        {lines.map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </li>
        ))}
      </ul>
      <div className="pricebox__row">
        <span className="pricebox__now">
          {formatEuros(paidPrice(price))}
          <small>EUR</small>
        </span>
        {hasDiscount(price) && <span className="pricebox__old">{formatEuros(Number(price.total_price))} EUR</span>}
      </div>
      <div className="pricebox__pn">Ukupno za smeštajnu jedinicu</div>
      <button className="btn-solid is-unavailable" type="button" title="Još nije povezano: nema rezervacija">
        Rezerviši termin <Icon name="arrowRight" />
      </button>
      <button className="btn-outline is-unavailable" type="button" title="Još nije povezano: nema upita agenciji">
        <Icon name="mail" />
        Pošalji upit agenciji
      </button>
    </div>
  );
}
