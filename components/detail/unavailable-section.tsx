export function UnavailableSection({ title, what }: { title: string; what: string }) {
  return (
    <section className="sec is-unavailable" title="Još nije povezano: nema podataka">
      <h2>{title}</h2>
      <p className="unavailable-note">Još nema podataka: {what}.</p>
    </section>
  );
}
