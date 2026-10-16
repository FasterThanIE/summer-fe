import type { ReactNode } from "react";
import type { PropertyDetail, Review } from "@/lib/types";
import { Icon } from "../icons";
import { Quote } from "./side-cards";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sec">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function AboutSection({ description, highlights }: Pick<PropertyDetail, "description" | "highlights">) {
  return (
    <Section title="O smestaju">
      {description.map((text) => (
        <p key={text}>{text}</p>
      ))}
      <div className="highlights">
        {highlights.map((h) => (
          <div key={h.title} className="hl">
            <Icon name={h.icon} />
            <div>
              <b>{h.title}</b>
              <span>{h.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function AmenitiesSection({ amenities }: Pick<PropertyDetail, "amenities">) {
  return (
    <Section title="Sadrzaji">
      <ul className="amen-grid">
        {amenities.map((a) => (
          <li key={a.label} className={a.available ? "" : "off"}>
            <Icon name={a.icon} />
            {a.label}
            {!a.available && <span className="sr"> (nije dostupno)</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function UnitSection({ room, beds, tags }: { room: string; beds: string; tags: string[] }) {
  return (
    <Section title="Smestajna jedinica">
      <div className="unit">
        <div>
          <b>{room}</b>
          <span>{beds}</span>
        </div>
        <div className="unit__tags">
          {tags.map((t) => (
            <i key={t}>{t}</i>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function LocationSection({ nearby }: Pick<PropertyDetail, "nearby">) {
  return (
    <Section title="Lokacija">
      <ul className="near">
        {nearby.map(([place, distance]) => (
          <li key={place}>
            <span>{place}</span>
            <span>{distance}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function RatingsSection({ subscores, review }: { subscores: [string, number][]; review: Review }) {
  return (
    <Section title="Ocene gostiju">
      <div className="bars">
        {subscores.map(([label, value]) => (
          <div key={label}>
            <div className="bar__top">
              <span>{label}</span>
              <span>{value.toFixed(1)}</span>
            </div>
            <div className="bar__track">
              <div className="bar__fill" style={{ width: `${value * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
      <Quote review={review} />
    </Section>
  );
}

export function RulesSection({ rules }: Pick<PropertyDetail, "rules">) {
  return (
    <Section title="Kucni red">
      <ul className="rules">
        {rules.map(([label, value]) => (
          <li key={label}>
            <b>{label}</b>
            {value}
          </li>
        ))}
      </ul>
    </Section>
  );
}
