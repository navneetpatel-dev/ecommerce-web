"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { HelpArticle } from "../../types/help.types";

type Props = {
  query: string;
  results: HelpArticle[];
};

export function SearchResultsSection({ query, results }: Props) {
  return (
    <section className="mt-8 border border-line bg-surface-raised shadow-elevation-1">
      <div className="border-b border-line px-5 py-4">
        <p className="text-[0.875rem] text-ink-muted">
          {formatLabel(
            results.length === 1
              ? LABELS.helpSearchResultSingular
              : LABELS.helpSearchResultPlural,
            { count: String(results.length), query: query.trim() },
          )}
        </p>
      </div>
      {results.length === 0 ? (
        <p className="px-5 py-10 text-center text-body text-ink-muted">
          {LABELS.helpSearchEmpty}
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {results.map((article) => (
            <li key={article.slug}>
              <Link
                href={`${PATHS.help}/${article.slug}`}
                className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{article.title}</p>
                  <p className="mt-1 text-[0.875rem] text-ink-muted">
                    {article.summary}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="mt-1 shrink-0 text-ink-muted"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
