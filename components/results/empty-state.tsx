import Link from "next/link";
import { ResetLink } from "./reset-link";

type EmptyStateProps = {
  firstPageHref?: string;
};

export function EmptyState({ firstPageHref }: EmptyStateProps) {
  if (firstPageHref) {
    return (
      <li className="empty">
        <h3>Nema rezultata na ovoj strani</h3>
        <p>Ova strana ne postoji. Vrati se na prvu stranu rezultata.</p>
        <Link className="prop__cta" href={firstPageHref}>
          Prva strana
        </Link>
      </li>
    );
  }

  return (
    <li className="empty">
      <h3>Nema smeštaja za ove filtere</h3>
      <p>Probaj da isključiš neki filter, promeniš broj osoba ili proširiš udaljenost od plaže.</p>
      <ResetLink className="prop__cta">Poništi filtere</ResetLink>
    </li>
  );
}
