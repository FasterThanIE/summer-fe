import Link from "next/link";
import type { PropertyDetail as PropertyDetailData } from "@/lib/types";
import { Icon } from "../icons";
import { Stars } from "../stars";
import { Gallery } from "./gallery";
import {
  AboutSection,
  AmenitiesSection,
  LocationSection,
  RatingsSection,
  RulesSection,
  UnitSection,
} from "./info-sections";
import { PriceBox } from "./price-box";
import { PriceListSection } from "./price-list";
import { AgencyCard, RatingCard } from "./side-cards";

type PropertyDetailProps = {
  detail: PropertyDetailData;
  backHref: string;
  isFavorite?: boolean;
};

export function PropertyDetail({ detail, backHref, isFavorite = false }: PropertyDetailProps) {
  const { property: p } = detail;
  const capacity = `do ${p.cap} ${p.cap < 5 ? "osobe" : "osoba"}`;

  return (
    <div className="detail">
      <div className="detail__nav">
        <Link className="back-pill" href={backHref}>
          <Icon name="arrowLeft" />
          Nazad na rezultate
        </Link>
        <nav className="crumbs" aria-label="Putanja">
          <span>Grcka</span>
          <Icon name="chevronRight" />
          <span>{p.region}</span>
          <Icon name="chevronRight" />
          <b>{p.city}</b>
        </nav>
      </div>

      <div className="detail__head">
        <div>
          <h1 id="detail-title" tabIndex={-1}>
            {p.name}
          </h1>
          <div className="detail__sub">
            <span className="type-pill">{p.typeLabel}</span>
            <Stars count={p.stars} />
            <span className="loc">
              <Icon name="pin" />
              {p.city}, {p.region}
            </span>
            <span className="dot" />
            <span>{p.beach} od plaze</span>
            <span className="dot" />
            <span>{capacity}</span>
          </div>
        </div>
        <div className="detail__actions">
          <button className="icon-btn" type="button">
            <Icon name="share" />
            Podeli
          </button>
          <button className="icon-btn" type="button" aria-pressed={isFavorite}>
            <Icon name={isFavorite ? "heart" : "heartOutline"} />
            {isFavorite ? "Sacuvano" : "Sacuvaj"}
          </button>
        </div>
      </div>

      <div className="detail__top">
        <Gallery images={detail.photos} name={p.name} />
        <aside className="side">
          <AgencyCard agency={detail.agency} />
          <RatingCard property={p} review={detail.reviews[0]} />
        </aside>
      </div>

      <div className="detail__body">
        <div className="sections">
          <PriceListSection
            table={detail.priceTable}
            packageLabel={detail.packageLabel}
            included={detail.included}
            excluded={detail.excluded}
          />
          <AboutSection description={detail.description} highlights={detail.highlights} />
          <AmenitiesSection amenities={detail.amenities} />
          <UnitSection room={p.room} beds={p.beds} tags={detail.unitTags} />
          <LocationSection nearby={detail.nearby} />
          <RatingsSection subscores={detail.subscores} review={detail.reviews[1]} />
          <RulesSection rules={detail.rules} />
        </div>
        <aside className="side side--sticky">
          <PriceBox summary={detail.priceSummary} />
        </aside>
      </div>
    </div>
  );
}
