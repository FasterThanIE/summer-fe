type EmptyStateProps = {
  message?: string;
};

export function EmptyState({
  message = "Probaj da iskljucis neki filter, promenis broj osoba ili prosiris udaljenost od plaze.",
}: EmptyStateProps) {
  return (
    <li className="empty">
      <h3>Nema smestaja za ove filtere</h3>
      <p>{message}</p>
      <button className="prop__cta" type="button">
        Ponisti filtere
      </button>
    </li>
  );
}
