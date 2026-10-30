"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { resultsHref } from "@/lib/ai-search/url-filters";
import { Icon } from "../icons";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      className="back-pill"
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(resultsHref({})))}
    >
      <Icon name="arrowLeft" />
      Nazad na rezultate
    </button>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function share() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
    }
  }

  return (
    <button className="icon-btn" type="button" onClick={share}>
      <Icon name="share" />
      {isCopied ? "Link kopiran" : "Podeli"}
    </button>
  );
}
