import { Icon } from "../icons";

type SaveSearchDialogProps = {
  open?: boolean;
  defaultName: string;
  summary: string[];
  error?: boolean;
};

export function SaveSearchDialog({ open = false, defaultName, summary, error = false }: SaveSearchDialogProps) {
  return (
    <dialog className="save-dlg" aria-labelledby="save-title" open={open}>
      <form method="dialog">
        <div className="save-dlg__icon" aria-hidden="true">
          <Icon name="bookmark" />
        </div>
        <h2 id="save-title">Sačuvaj pretragu</h2>
        <p className="save-dlg__lead">
          Daj joj ime da je lako nađeš kasnije. Čuvamo destinacije, broj noći i osoba i sve filtere.
        </p>
        <label className="save-dlg__label" htmlFor="save-name">
          Naziv pretrage
        </label>
        <input id="save-name" type="text" maxLength={60} autoComplete="off" defaultValue={defaultName} />
        <p className="save-dlg__err" hidden={!error}>
          Upiši naziv pretrage.
        </p>
        <div className="save-dlg__summary">
          {summary.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="save-dlg__actions">
          <button type="button" className="ghost-btn">
            Otkazi
          </button>
          <button type="submit" className="save-btn save-btn--solid">
            Sačuvaj
          </button>
        </div>
      </form>
    </dialog>
  );
}
