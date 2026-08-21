"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { Category } from "@/shared/api/types";
import { CategoryMegaMenuTile } from "./CategoryMegaMenuTile";

interface CategoriesMegaMenuProps {
  categories: Category[];
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * ACTIVE taxonomy mega menu — up to 3 levels (Department → Category → Subcategory).
 */
export function CategoriesMegaMenu({
  categories,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: CategoriesMegaMenuProps) {
  const count = categories.length;

  return (
    <div
      className="absolute left-0 top-full z-50 mt-3 w-[min(980px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface-raised shadow-elevation-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/50 px-4 py-3.5 sm:px-5">
        <div>
          <p className="text-[0.875rem] font-semibold text-ink">
            {LABELS.allCategories}
          </p>
          <p className="mt-0.5 text-[0.75rem] text-ink-muted">
            {count === 0
              ? LABELS.categoryPlpEmpty
              : formatLabel(LABELS.categoryDepartmentCount, { count })}
          </p>
        </div>
        <Link
          href={PATHS.categories}
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-brand transition-colors hover:border-brand/30 hover:bg-brand-subtle"
        >
          {LABELS.allCategories} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="max-h-[min(62vh,520px)] overflow-y-auto overscroll-contain p-3 sm:p-4">
          {count === 0 ? (
            <p className="px-2 py-10 text-center text-[0.9375rem] text-ink-muted">
              {LABELS.categoryPlpEmpty}
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((department) => (
                <CategoryMegaMenuTile
                  key={department.id}
                  department={department}
                  tree={categories}
                  onClose={onClose}
                />
              ))}
            </ul>
          )}
        </div>

        <aside className="border-t border-line bg-gradient-to-br from-brand-subtle via-paper to-surface p-5 lg:border-l lg:border-t-0">
          <div className="flex h-full flex-col justify-between gap-5">
            <div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Sparkles className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="mt-3 font-display text-[1.125rem] leading-snug text-ink">
                {LABELS.featured}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                {LABELS.categoryExploreCollection}
              </p>
            </div>
            <Link
              href={PATHS.productsNewest}
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[0.8125rem] font-semibold text-paper transition-colors hover:bg-brand-hover sm:w-auto"
            >
              {LABELS.shopNewArrivals}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
