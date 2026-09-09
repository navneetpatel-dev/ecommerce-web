"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import {
  CategoryCard,
  CategoryMoreCard,
  getRootCategories,
} from "@/features/categories";
import { CategoryGridSkeleton } from "@/shared/components/Skeletons.component";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
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
  const overflow = hasMore ? roots.slice(HOME_CATEGORY_LIMIT) : [];

  return (
    <section>
      <CategoryRailHeader totalCount={mounted ? roots.length : undefined} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
        {visible.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}

        {hasMore ? (
          <CategoryMoreCard
            href={PATHS.categories}
            moreCount={roots.length - HOME_CATEGORY_LIMIT}
            overflowCategories={overflow}
          />
        ) : null}
      </div>
    </section>
  );
}
