type HeroProps = {
  examples: string[];
  hint?: string;
  action?: string;
};

export function Hero({ examples, hint = "Destinacija, termin, broj osoba, budzet, zelje", action = "/rezultati" }: HeroProps) {
  return (
    <main className="hero">
      <p className="eyebrow">Leto 2027 · Grcka</p>
      <h1>Planiras putovanje?</h1>
      <p className="subtitle">
        Unesi gde bi zeleo da ides, koliko novca da potrosis i sve ostale relevantne podatke ispod
      </p>

      <form className="prompt" action={action}>
        <label className="sr" htmlFor="trip">
          Opis putovanja
        </label>
        <textarea
          id="trip"
          name="q"
          rows={3}
          placeholder="Zelim da letujem u grckoj u Julu, 10 dana, idemo nas 2 sa 2 dece, nesto do 1000 eur blizu mora"
        />
        <div className="prompt__bar">
          <span className="hint">{hint}</span>
          <button className="btn" type="submit">
            Pronadji ponude <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </form>

      <div className="examples">
        <span className="examples__label">Ili probaj neki primer:</span>
        {examples.map((example) => (
          <button key={example} className="chip" type="button">
            {example}
          </button>
        ))}
      </div>
    </main>
  );
}
