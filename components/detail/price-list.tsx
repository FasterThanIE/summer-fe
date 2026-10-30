import { formatEuros, shortDate } from "@/lib/ai-search/present";
import { hasDiscount, paidPrice } from "@/lib/offers";
import type { DetailUnit, Price } from "@/lib/types";

type PriceListSectionProps = {
  units: DetailUnit[];
  nightsOptions: number[];
  nights: number;
  onNightsChange: (nights: number) => void;
  selectedPriceId: number | null;
  onSelect: (priceId: number) => void;
};

export function PriceListSection({ units, nightsOptions, nights, onNightsChange, selectedPriceId, onSelect }: PriceListSectionProps) {
  return (
    <section className="sec pl" aria-labelledby="pl-title">
      <div className="pl__top">
        <div>
          <h2 id="pl-title">Cenovnik i termini</h2>
          <p className="pl__lead">Ukupna cena smeštajne jedinice u EUR za ceo boravak. Klikni na cenu da izabereš termin.</p>
        </div>
        <div className="seg" role="group" aria-label="Broj noći">
          {nightsOptions.map((option) => (
            <button key={option} type="button" aria-pressed={option === nights} onClick={() => onNightsChange(option)}>
              {option} noći
            </button>
          ))}
          <button type="button" className="is-unavailable" disabled title="Još nije povezano: nema paketa sa prevozom">
            Paket sa prevozom
          </button>
        </div>
      </div>

      {nightsOptions.length === 0 ? (
        <p className="unavailable-note">Trenutno nema slobodnih termina.</p>
      ) : (
        <PriceTable units={units} nights={nights} selectedPriceId={selectedPriceId} onSelect={onSelect} />
      )}

      <ul className="pl__legend">
        <li>
          <span className="lg lg--sel" />
          Izabrani termin
        </li>
        <li>
          <span className="lg lg--min" />
          Najpovoljniji termin za jedinicu
        </li>
        <li>
          <b>*</b> Cena sa popustom
        </li>
        <li>
          <b>–</b> Nema termina
        </li>
      </ul>
      <div className="pl__incl is-unavailable" title="Još nije povezano: nema podataka">
        <div>
          <b>Cena uključuje</b>
          <span>Još nema podataka.</span>
        </div>
        <div>
          <b>Cena ne uključuje</b>
          <span>Još nema podataka.</span>
        </div>
      </div>
    </section>
  );
}

type PriceTableProps = {
  units: DetailUnit[];
  nights: number;
  selectedPriceId: number | null;
  onSelect: (priceId: number) => void;
};

function PriceTable({ units, nights, selectedPriceId, onSelect }: PriceTableProps) {
  const stays = [
    ...new Map(
      units
        .flatMap((unit) => unit.prices)
        .filter((price) => price.nights === nights)
        .map((price) => [`${price.check_in}|${price.check_out}`, { checkIn: price.check_in, checkOut: price.check_out }]),
    ).values(),
  ].sort((first, second) => first.checkIn.localeCompare(second.checkIn));
  const rows = units.map((unit) => ({
    unit,
    cells: stays.map((stay) => unit.prices.find((price) => price.check_in === stay.checkIn && price.check_out === stay.checkOut) ?? null),
  }));
  const selectedStay = stays.findIndex((_, column) => rows.some((row) => row.cells[column]?.id === selectedPriceId));
  const columnClass = (column: number, base = "") => [base, column === selectedStay && "is-col"].filter(Boolean).join(" ");

  return (
    <div className="pl__scroll" tabIndex={0} role="region" aria-label="Cenovnik po terminima">
      <table className="pl__table">
        <thead>
          <tr>
            <th className="pl__sticky" rowSpan={2} scope="col">
              Smeštajna jedinica
            </th>
            <th className="pl__pay" rowSpan={2} scope="col">
              Osoba
            </th>
            {stays.map((stay, column) => (
              <th key={stay.checkIn} scope="col" className={columnClass(column)}>
                <span className="pl__n">{nights} noći</span>
              </th>
            ))}
          </tr>
          <tr>
            {stays.map((stay, column) => (
              <th key={stay.checkIn} scope="col" className={columnClass(column, "pl__dates")}>
                {shortDate(stay.checkIn)}
                <br />
                {shortDate(stay.checkOut)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ unit, cells }) => {
            const offered = cells.filter((cell) => cell !== null);
            const cheapest = offered.length > 0 ? Math.min(...offered.map(paidPrice)) : null;

            return (
              <tr key={unit.id} className={cells.some((cell) => cell?.id === selectedPriceId) ? "is-row" : ""}>
                <th scope="row" className="pl__sticky">
                  {unit.name}
                </th>
                <td className="pl__pay">{unit.max_guests}</td>
                {cells.map((price, column) => (
                  <td key={stays[column].checkIn}>
                    <PriceCellButton
                      price={price}
                      isCheapest={price !== null && paidPrice(price) === cheapest}
                      isSelected={price !== null && price.id === selectedPriceId}
                      label={`${unit.name}, ${shortDate(stays[column].checkIn)} – ${shortDate(stays[column].checkOut)}`}
                      onSelect={onSelect}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type PriceCellButtonProps = {
  price: Price | null;
  isCheapest: boolean;
  isSelected: boolean;
  label: string;
  onSelect: (priceId: number) => void;
};

function PriceCellButton({ price, isCheapest, isSelected, label, onSelect }: PriceCellButtonProps) {
  if (!price) {
    return (
      <span className="pl__none" title="Nema termina">
        –
      </span>
    );
  }

  const isDiscounted = hasDiscount(price);
  const classes = ["pl__cell", isCheapest && "is-min", isSelected && "is-sel"].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={isSelected}
      aria-label={`${label}: ${formatEuros(paidPrice(price))} EUR${isDiscounted ? ", cena sa popustom" : ""}`}
      onClick={() => onSelect(price.id)}
    >
      {formatEuros(paidPrice(price))}
      {isDiscounted && <sup>*</sup>}
    </button>
  );
}
