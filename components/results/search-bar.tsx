import Link from "next/link";
import { Icon } from "../icons";

type SearchBarProps = {
  value: string;
  backHref?: string;
};

export function SearchBar({ value, backHref = "/" }: SearchBarProps) {
  return (
    <div className="results__bar">
      <form className="results__bar-inner">
        <Link className="back" href={backHref} aria-label="Nazad na pocetnu">
          <Icon name="arrowLeft" />
        </Link>
        <div className="re-search">
          <Icon name="search" />
          <label className="sr" htmlFor="re-q">
            Izmeni pretragu
          </label>
          <input id="re-q" name="q" type="text" autoComplete="off" defaultValue={value} />
          <button className="btn" type="submit">
            <span className="lbl">Trazi</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </form>
    </div>
  );
}
