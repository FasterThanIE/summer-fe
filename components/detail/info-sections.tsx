import type { ReactNode } from "react";
import { AMENITY_ICONS, UNIT_TYPE_LABELS, countWord, formatEuros } from "@/lib/ai-search/present";
import type { AccommodationDetail, DetailUnit } from "@/lib/types";
import type { IconName } from "../icons";
import { Icon } from "../icons";
import { UnavailableSection } from "./unavailable-section";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sec">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function AboutSection({ accommodation }: { accommodation: AccommodationDetail }) {
  const mostGuests = Math.max(0, ...accommodation.units.map((unit) => unit.max_guests));
  const highlights: { icon: IconName; title: string; sub: string }[] = [
    ...(accommodation.beach_distance_m === null
      ? []
      : [{ icon: "beach" as const, title: `${formatEuros(accommodation.beach_distance_m)} m`, sub: "do plaže" }]),
    ...(mostGuests > 0
      ? [{ icon: "users" as const, title: `do ${mostGuests} ${countWord(mostGuests, "osobe", "osobe", "osoba")}`, sub: "najveća jedinica" }]
      : []),
    ...(accommodation.stars === null
      ? []
      : [{ icon: "star" as const, title: `${accommodation.stars} ${countWord(accommodation.stars, "zvezdica", "zvezdice", "zvezdica")}`, sub: "kategorija" }]),
  ];

  return (
    <Section title="O smeštaju">
      {(accommodation.description ?? "").split("\n").filter(Boolean).map((text) => (
        <p key={text}>{text}</p>
      ))}
      {highlights.length > 0 && (
        <div className="highlights">
          {highlights.map((highlight) => (
            <div key={highlight.title} className="hl">
              <Icon name={highlight.icon} />
              <div>
                <b>{highlight.title}</b>
                <span>{highlight.sub}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

export function AmenitiesSection({ available, all }: { available: string[]; all: string[] }) {
  const names = all.length > 0 ? all : available;

  return (
    <Section title="Sadržaji">
      <ul className="amen-grid">
        {names.map((name) => {
          const isAvailable = available.includes(name);

          return (
            <li key={name} className={isAvailable ? "" : "off"}>
              <Icon name={AMENITY_ICONS[name] ?? "check"} />
              {name}
              {!isAvailable && <span className="sr"> (nije dostupno)</span>}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function UnitSection({ unit }: { unit: DetailUnit }) {
  return (
    <Section title="Smeštajna jedinica">
      <div className="unit">
        <div>
          <b>{unit.name}</b>
          {unit.beds && <span>{unit.beds}</span>}
        </div>
        <div className="unit__tags">
          <i>{UNIT_TYPE_LABELS[unit.type].label}</i>
          <i>
            do {unit.max_guests} {countWord(unit.max_guests, "osobe", "osobe", "osoba")}
          </i>
        </div>
      </div>
    </Section>
  );
}

export function LocationSection({ accommodation }: { accommodation: AccommodationDetail }) {
  const { latitude, longitude } = accommodation;

  return (
    <Section title="Lokacija">
      <ul className="near">
        <li>
          <span>Mesto</span>
          <span>{[accommodation.city.name, ...accommodation.regions.slice(0, 2)].filter((name, i, all) => all.indexOf(name) === i).join(", ")}</span>
        </li>
        {accommodation.beach_distance_m !== null && (
          <li>
            <span>Plaža</span>
            <span>{formatEuros(accommodation.beach_distance_m)} m</span>
          </li>
        )}
        {latitude && longitude && (
          <li>
            <span>Na mapi</span>
            <a href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} target="_blank" rel="noreferrer">
              Otvori Google mape
            </a>
          </li>
        )}
      </ul>
      <p className="unavailable-note is-unavailable" title="Još nije povezano: nema podataka">
        Još nema podataka o mestima u blizini (prodavnica, taverna, aerodrom).
      </p>
    </Section>
  );
}

export function RatingsSection() {
  return <UnavailableSection title="Ocene gostiju" what="ocene i utisci gostiju" />;
}

export function RulesSection() {
  return <UnavailableSection title="Kućni red" what="prijava, odjava, ljubimci i otkazivanje" />;
}
