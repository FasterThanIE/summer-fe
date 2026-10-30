import type { SavedSearch } from "@/lib/types";
import { Icon } from "../icons";

type SavedSearchesMenuProps = {
  saved: SavedSearch[];
  open?: boolean;
};

export function SavedSearchesMenu({ saved, open = false }: SavedSearchesMenuProps) {
  if (!saved.length) return null;

  return (
    <div className="saved">
      <button className="ghost-btn" type="button" aria-expanded={open} aria-controls="saved-menu">
        <Icon name="menu" />
        Moje pretrage <b>{saved.length}</b>
      </button>
      <div className="saved__menu" id="saved-menu" hidden={!open}>
        <ul>
          {saved.map((s) => (
            <li key={s.name}>
              <button type="button" className="saved__item">
                <span>{s.name}</span>
                <small>{s.summary}</small>
              </button>
              <button type="button" className="saved__del" aria-label={`Obriši ${s.name}`}>
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
