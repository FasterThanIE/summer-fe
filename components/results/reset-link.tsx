"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { forgetSearch } from "@/lib/ai-search/last-search";
import { resultsHref } from "@/lib/ai-search/url-filters";

export function ResetLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <Link className={className} href={resultsHref({})} onClick={forgetSearch}>
      {children}
    </Link>
  );
}
