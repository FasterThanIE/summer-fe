"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="results results--message">
      <div className="empty empty--page" role="alert">
        <h1>Nešto nije u redu</h1>
        <p>Stranica trenutno ne može da se prikaže. Pokušaj ponovo za par trenutaka.</p>
        <div className="empty__actions">
          <button className="prop__cta" type="button" onClick={retry}>
            Pokušaj ponovo
          </button>
          <Link className="prop__cta" href="/">
            Na početnu
          </Link>
        </div>
      </div>
    </section>
  );
}
