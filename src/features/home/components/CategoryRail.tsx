'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { CategoryCard, getRootCategories } from '@/features/categories'
import { cn } from '@/shared/utils/cn'
import type { Category } from '@/shared/api/types'

const HOME_CATEGORY_LIMIT = 10

interface CategoryRailProps {
  categories: Category[]
}

export function CategoryRail({ categories }: CategoryRailProps) {
  const roots = getRootCategories(categories)
  if (!roots.length) return null

  const showViewAll = roots.length > HOME_CATEGORY_LIMIT
  const visible = showViewAll ? roots.slice(0, HOME_CATEGORY_LIMIT) : roots

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <TextEyebrow className="mb-2">Browse</TextEyebrow>
          <h2 className="text-[1.375rem] font-semibold text-ink">Shop by Category</h2>
        </div>
        {showViewAll ? (
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-1 text-[0.9375rem] font-medium text-brand transition-colors hover:text-brand-hover"
          >
            View all
            <span className="tabular-nums text-ink-muted">({roots.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
        {visible.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}

        {showViewAll ? (
          <Link
            href="/categories"
            className={cn(
              'group relative flex aspect-[4/3] flex-col items-start justify-between overflow-hidden rounded-md',
              'border border-dashed border-line bg-surface p-3 md:p-3.5',
              'transition-colors duration-200 hover:border-brand hover:bg-brand-subtle',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
            )}
          >
            <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink-muted group-hover:text-brand">
              +{roots.length - HOME_CATEGORY_LIMIT} more
            </span>
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-[0.9375rem] font-medium text-ink group-hover:text-brand">
                View all categories
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
  )
}
