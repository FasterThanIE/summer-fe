import Link from "next/link";
import { PARAM, resultsHref } from "@/lib/ai-search/url-filters";
import { Icon } from "../icons";

type PaginationProps = {
  page: number;
  lastPage: number;
  params: Record<string, string>;
};

export function Pagination({ page, lastPage, params }: PaginationProps) {
  if (lastPage <= 1) {
    return null;
  }

  const hrefFor = (target: number) => resultsHref({ ...params, [PARAM.page]: String(target) });

  return (
    <nav className="pager" aria-label="Strane rezultata">
      {page > 1 ? (
        <Link className="pager__link" href={hrefFor(page - 1)} rel="prev">
          <Icon name="chevronLeft" />
          Prethodna
        </Link>
      ) : (
        <span />
      )}
      <span className="pager__info">
        Strana {page} od {lastPage}
      </span>
      {page < lastPage ? (
        <Link className="pager__link" href={hrefFor(page + 1)} rel="next">
          Sledeća
          <Icon name="chevronRight" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
