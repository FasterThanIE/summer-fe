import Link from "next/link";
import { agencyBadge, countWord } from "@/lib/ai-search/present";
import { PARAM, resultsHref } from "@/lib/ai-search/url-filters";
import type { AccommodationDetail } from "@/lib/types";
import { Icon } from "../icons";

type AgencyCardProps = {
  agency: AccommodationDetail["agency"];
  sourceUrl: string | null;
};

export function AgencyCard({ agency, sourceUrl }: AgencyCardProps) {
  const badge = agencyBadge(agency);
  const isWebLink = sourceUrl !== null && /^https?:\/\//i.test(sourceUrl);

  return (
    <div className="card">
      <p className="card__label">Ponudu organizuje</p>
      <div className="ag">
        <span className="ag__logo" style={{ background: badge.color }}>
          {badge.initials}
        </span>
        <div>
          <p className="ag__name">{agency.name}</p>
          <div className="ag__meta">
            <span className="ag__verified is-unavailable" title="Još nije povezano: nema podataka o licenci">
              <Icon name="shield" />
              Licencirana agencija
            </span>{" "}
            · {agency.city}
          </div>
        </div>
      </div>
      <div className="ag__stats">
        <div className="ag__stat is-unavailable" title="Još nije povezano: nema ocena agencija">
          <b>–</b>
          <span>ocena</span>
        </div>
        <div className="ag__stat">
          <b>{agency.accommodations_count}</b>
          <span>{countWord(agency.accommodations_count, "smeštaj", "smeštaja", "smeštaja")}</span>
        </div>
        <div className="ag__stat is-unavailable" title="Još nije povezano: nema podataka o godinama rada">
          <b>–</b>
          <span>godina rada</span>
        </div>
      </div>
      <Link className="btn-outline" href={resultsHref({ [PARAM.agency]: agency.name })}>
        <Icon name="list" />
        Svi smeštaji agencije
      </Link>
      {isWebLink && (
        <a className="btn-outline" href={sourceUrl} target="_blank" rel="noopener nofollow">
          <Icon name="arrowRight" />
          Originalni oglas agencije
        </a>
      )}
    </div>
  );
}

export function RatingCard() {
  return (
    <div className="card is-unavailable" title="Još nije povezano: nema ocena gostiju">
      <p className="card__label">Ocena gostiju</p>
      <p className="unavailable-note">Još nema ocena gostiju.</p>
    </div>
  );
}
