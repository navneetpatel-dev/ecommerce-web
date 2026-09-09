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
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import type { Category } from "@/shared/api/types";
import { categoryRailStyles as styles } from "./categoryRail.styles";

const HOME_CATEGORY_LIMIT = 10;

interface CategoryRailProps {
  categories?: Category[];
  isLoading?: boolean;
}

function CategoryRailHeader({ totalCount }: { totalCount?: number }) {
  const hasMore = totalCount != null && totalCount > HOME_CATEGORY_LIMIT;

  return (
    <div className={styles.headerWrapper}>
      <div>
        <TextEyebrow className={styles.headerEyebrow}>
          {LABELS.browse}
        </TextEyebrow>
        <h2 className={styles.headerTitle}>{LABELS.shopByCategory}</h2>
      </div>
      {hasMore ? (
        <Link href={PATHS.categories} className={styles.viewAllLink}>
          {LABELS.viewAll}
          <span className={styles.totalCountSpan}>({totalCount})</span>
          <ArrowRight className={styles.arrowIcon} />
        </Link>
      ) : (
        <span className={styles.viewAllPlaceholder} aria-hidden>
          {LABELS.viewAll}
          <ArrowRight className={styles.arrowIcon} />
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

      <div className={styles.grid}>
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
