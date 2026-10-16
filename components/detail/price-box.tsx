import type { PriceSummary } from "@/lib/types";
import { Icon } from "../icons";

export function PriceBox({ summary }: { summary: PriceSummary }) {
  return (
    <div className="card pricebox">
      <p className="card__label">Izabrani termin</p>
      <div className="pb__term">
        <b>{summary.term}</b>
        <span>{summary.nights}</span>
      </div>
      <ul className="pb__lines">
        {summary.lines.map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </li>
        ))}
      </ul>
      <div className="pricebox__row">
        <span className="pricebox__now">
          {summary.total}
          <small>EUR</small>
        </span>
        {summary.oldTotal && <span className="pricebox__old">{summary.oldTotal} EUR</span>}
      </div>
      <div className="pricebox__pn">{summary.totalFor}</div>
      <button className="btn-solid" type="button">
        Rezervisi termin <Icon name="arrowRight" />
      </button>
      <button className="btn-outline" type="button">
        <Icon name="mail" />
        Posalji upit agenciji
      </button>
      <p className="pricebox__note">
        <Icon name="check" />
        {summary.note}
      </p>
    </div>
  );
}
