"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { CategoryCard, getRootCategories } from "@/features/categories";
import { CategoryGridSkeleton } from "@/shared/components/Skeletons.component";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { cn } from "@/shared/utils/cn";
import type { Category } from "@/shared/api/types";

const HOME_CATEGORY_LIMIT = 10;

interface CategoryRailProps {
  categories?: Category[];
  isLoading?: boolean;
}

function CategoryRailHeader({ totalCount }: { totalCount?: number }) {
  const hasMore = totalCount != null && totalCount > HOME_CATEGORY_LIMIT;

  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <TextEyebrow className="mb-2">{LABELS.browse}</TextEyebrow>
        <h2 className="text-[1.375rem] font-semibold text-ink">
          {LABELS.shopByCategory}
        </h2>
      </div>
      {hasMore ? (
        <Link
          href={PATHS.categories}
          className="inline-flex shrink-0 items-center gap-1 text-body font-medium text-brand transition-colors hover:text-brand-hover"
        >
          {LABELS.viewAll}
          <span className="tabular-nums text-ink-muted">({totalCount})</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span
          className="invisible inline-flex shrink-0 items-center gap-1 text-body font-medium"
          aria-hidden
        >
          {LABELS.viewAll}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}

export function CategoryRail({
  categories = [],
  isLoading,
}: CategoryRailProps) {
  const [mounted, setMounted] = useState(false);
  const roots = getRootCategories(categories);
  const showSkeleton = !mounted || (isLoading && roots.length === 0);

  useEffect(() => setMounted(true), []);

  if (showSkeleton) {
    return (
      <section>
        <CategoryRailHeader />
        <CategoryGridSkeleton count={10} />
      </section>
    );
  }

  if (!roots.length) return null;

  const hasMore = roots.length > HOME_CATEGORY_LIMIT;
  const visible = hasMore ? roots.slice(0, HOME_CATEGORY_LIMIT) : roots;

  return (
    <section>
      <CategoryRailHeader totalCount={mounted ? roots.length : undefined} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
        {visible.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}

        {hasMore ? (
          <Link
            href={PATHS.categories}
            className={cn(
              "group relative flex aspect-[4/3] flex-col items-start justify-between overflow-hidden rounded-md",
              "border border-dashed border-line-strong bg-paper p-3 md:p-3.5",
              "dark:bg-surface",
              "transition-colors duration-200 hover:border-brand hover:bg-brand-subtle",
              "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            )}
          >
            <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink-muted group-hover:text-brand">
              {formatLabel(LABELS.moreCategoriesCount, {
                count: String(roots.length - HOME_CATEGORY_LIMIT),
              })}
            </span>
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-body font-medium text-ink group-hover:text-brand">
                {LABELS.browseCategories}
              </span>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0 text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
