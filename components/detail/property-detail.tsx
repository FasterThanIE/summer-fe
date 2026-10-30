import { UNIT_TYPE_LABELS, countWord, formatEuros } from "@/lib/ai-search/present";
import type { AccommodationDetail } from "@/lib/types";
import { Icon } from "../icons";
import { Stars } from "../stars";
import { BackButton, ShareButton } from "./detail-actions";
import { DetailBody } from "./detail-body";
import { Gallery } from "./gallery";
import { AboutSection, AmenitiesSection, LocationSection, RatingsSection, RulesSection } from "./info-sections";
import { AgencyCard, RatingCard } from "./side-cards";

type PropertyDetailProps = {
  accommodation: AccommodationDetail;
  allAmenities: string[];
  selectedPriceId: number | null;
};

export function PropertyDetail({ accommodation, allAmenities, selectedPriceId }: PropertyDetailProps) {
  const { units } = accommodation;
  const mostGuests = Math.max(0, ...units.map((unit) => unit.max_guests));
  const types = [...new Set(units.map((unit) => UNIT_TYPE_LABELS[unit.type].label))];
  const area = accommodation.regions.find((name) => name !== accommodation.city.name) ?? accommodation.regions[0];
  const crumbs = [...accommodation.regions].reverse().filter((name, i, all) => all.indexOf(name) === i && name !== accommodation.city.name);

  return (
    <div className="detail">
      <div className="detail__nav">
        <BackButton />
        <nav className="crumbs" aria-label="Putanja">
          {crumbs.map((name) => (
            <span key={name}>
              {name}
              <Icon name="chevronRight" />
            </span>
          ))}
          <b>{accommodation.city.name}</b>
        </nav>
      </div>

      <div className="detail__head">
        <div>
          <h1 id="detail-title" tabIndex={-1}>
            {accommodation.name}
          </h1>
          <div className="detail__sub">
            {types.map((type) => (
              <span key={type} className="type-pill">
                {type}
              </span>
            ))}
            {accommodation.stars !== null && <Stars count={accommodation.stars} />}
            <span className="loc">
              <Icon name="pin" />
              {accommodation.city.name}
              {area ? `, ${area}` : ""}
            </span>
            {accommodation.beach_distance_m !== null && (
              <>
                <span className="dot" />
                <span>{formatEuros(accommodation.beach_distance_m)} m od plaže</span>
              </>
            )}
            {mostGuests > 0 && (
              <>
                <span className="dot" />
                <span>
                  do {mostGuests} {countWord(mostGuests, "osobe", "osobe", "osoba")}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="detail__actions">
          <ShareButton title={accommodation.name} />
          <button className="icon-btn is-unavailable" type="button" title="Još nije povezano: nema omiljenih">
            <Icon name="heartOutline" />
            Sačuvaj
          </button>
        </div>
      </div>

      <div className="detail__top">
        <Gallery images={[...new Set(accommodation.photos)]} name={accommodation.name} />
        <aside className="side">
          <AgencyCard agency={accommodation.agency} sourceUrl={accommodation.source_url} />
          <RatingCard />
        </aside>
      </div>

      <DetailBody units={units} initialPriceId={selectedPriceId}>
        <AboutSection accommodation={accommodation} />
        <AmenitiesSection available={accommodation.amenities} all={allAmenities} />
        <LocationSection accommodation={accommodation} />
        <RatingsSection />
        <RulesSection />
      </DetailBody>
    </div>
  );
}
