"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PATHS } from "@/shared/constants/paths";
import type { HelpCategory } from "../../constants/helpContent";
import { CategoryIcon } from "./CategoryIcon.component";

export function CategoryCard({ category }: { category: HelpCategory }) {
  const articleElements = category.articles.map((article) => (
    <li key={article.slug}>
      <Link
        href={`${PATHS.help}/${article.slug}`}
        className="flex items-center justify-between gap-3 py-3 text-[0.875rem] text-ink transition-colors hover:text-brand"
      >
        <span className="min-w-0 truncate">{article.title}</span>
        <ChevronRight size={14} className="shrink-0 text-ink-muted" />
      </Link>
    </li>
  ));

  return (
    <li className="border border-line bg-surface-raised p-5 shadow-elevation-1">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper">
          <CategoryIcon name={category.icon} />
        </span>
        <div className="min-w-0">
          <h3 className="text-body-lg font-semibold tracking-tight text-ink">
            {category.title}
          </h3>
          <p className="mt-1 text-body-sm text-ink-muted">
            {category.description}
          </p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-line border-t border-line">
        {articleElements}
      </ul>
    </li>
  );
}
