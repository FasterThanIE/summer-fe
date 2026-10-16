import type { PriceCell, PriceTable as PriceTableData } from "@/lib/types";

type PriceListSectionProps = {
  table: PriceTableData;
  packageLabel: string;
  included: string;
  excluded: string;
  mode?: "pkg" | "own";
  stayNights?: number;
};

export function PriceListSection({ table, packageLabel, included, excluded, mode = "pkg", stayNights = 10 }: PriceListSectionProps) {
  return (
    <section className="sec pl" aria-labelledby="pl-title">
      <div className="pl__top">
        <div>
          <h2 id="pl-title">Cenovnik i termini</h2>
          <p className="pl__lead">
            Cene su po osobi u EUR za {stayNights} noci. Klikni na cenu da izaberes termin i strukturu.
          </p>
        </div>
        <div className="seg" role="group" aria-label="Vrsta ponude">
          <button type="button" aria-pressed={mode === "pkg"}>
            {packageLabel}
          </button>
          <button type="button" aria-pressed={mode === "own"}>
            Samo smestaj
          </button>
        </div>
      </div>

      <PriceTable table={table} stayNights={stayNights} />

      <ul className="pl__legend">
        <li>
          <span className="lg lg--sel" />
          Izabrani termin
        </li>
        <li>
          <span className="lg lg--min" />
          Najpovoljniji termin za strukturu
        </li>
        <li>
          <b>*</b> Cena sa popustom za rani upis do 31.01.2027.
        </li>
        <li>
          <b>–</b> Popunjeno
        </li>
      </ul>
      <div className="pl__incl">
        <div>
          <b>Cena ukljucuje</b>
          <span>{included}</span>
        </div>
        <div>
          <b>Cena ne ukljucuje</b>
          <span>{excluded}</span>
        </div>
      </div>
    </section>
  );
}

export function PriceTable({ table, stayNights }: { table: PriceTableData; stayNights: number }) {
  const colClass = (i: number, base = "") => [base, i === table.selectedColumn && "is-col"].filter(Boolean).join(" ");

  return (
    <div>
      <div className="pl__head">{table.heading}</div>
      <div className="pl__scroll" tabIndex={0} role="region" aria-label="Cenovnik po terminima">
        <table className="pl__table">
          <thead>
            <tr>
              <th className="pl__sticky" rowSpan={2} scope="col">
                Struktura
              </th>
              <th className="pl__aux" rowSpan={2} scope="col">
                Pomocni lezaj
              </th>
              <th className="pl__pay" rowSpan={2} scope="col">
                Platnih osoba
              </th>
              {table.periods.map((period, i) => (
                <th key={period.from} scope="col" className={colClass(i)}>
                  <span className="pl__n">{stayNights} noci</span>
                </th>
              ))}
            </tr>
            <tr>
              {table.periods.map((period, i) => (
                <th key={period.from} scope="col" className={colClass(i, "pl__dates")}>
                  {period.from}
                  <br />
                  {period.to}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={row.label} className={ri === table.selectedRow ? "is-row" : ""}>
                <th scope="row" className="pl__sticky">
                  {row.label}
                </th>
                <td className="pl__aux">{row.aux}</td>
                <td className="pl__pay">{row.paying}</td>
                {row.cells.map((cell, ci) => (
                  <td key={table.periods[ci].from}>
                    <PriceCellButton cell={cell} label={`${row.label}, ${table.periods[ci].from} – ${table.periods[ci].to}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriceCellButton({ cell, label }: { cell: PriceCell; label: string }) {
  if (!cell) {
    return (
      <span className="pl__none" title="Popunjeno">
        –
      </span>
    );
  }
  const classes = ["pl__cell", cell.cheapest && "is-min", cell.selected && "is-sel"].filter(Boolean).join(" ");
  return (
    <button
      type="button"
      className={classes}
      aria-pressed={Boolean(cell.selected)}
      aria-label={`${label}: ${cell.price} EUR po osobi${cell.promo ? ", cena sa popustom za rani upis" : ""}`}
    >
      {cell.price}
      {cell.promo && <sup>*</sup>}
    </button>
  );
}
