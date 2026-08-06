'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { PATHS } from '@/shared/constants/paths'
import { resolveCategoryIcon } from '../utils/categoryHelpers'
import type { Category } from '@/shared/api/types'

interface CategoriesMegaMenuProps {
  categories: Category[]
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

/**
 * Scales for any N: dense multi-column list with max-height scroll,
 * plus a fixed promo rail. Avoids card-grid explosion when categories grow.
 */
export function CategoriesMegaMenu({
  categories,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: CategoriesMegaMenuProps) {
  const count = categories.length
  const columns =
    count > 18 ? 'grid-cols-3' : count > 8 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div
      className="absolute left-0 top-full mt-3 w-[min(920px,calc(100vw-2rem))] overflow-hidden rounded-md border border-line bg-surface-raised shadow-elevation-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <div>
          <p className="text-[0.8125rem] font-semibold text-ink">All categories</p>
          <p className="mt-0.5 text-[0.75rem] text-ink-muted">
            {count === 0 ? 'Nothing listed yet' : `${count} collection${count === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link
          href={PATHS.categories}
          onClick={onClose}
          className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-brand transition-colors hover:text-brand-hover"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="max-h-[min(60vh,440px)] overflow-y-auto overscroll-contain p-3 md:p-4">
          {count === 0 ? (
            <p className="px-2 py-8 text-center text-[0.9375rem] text-ink-muted">
              Categories will appear here once published.
            </p>
          ) : (
            <ul className={cn('grid gap-1', columns)}>
              {categories.map((category) => {
                const Icon = resolveCategoryIcon(category)
                return (
                  <li key={category.id}>
                    <Link
                      href={`${PATHS.products}?categoryId=${category.id}`}
                      onClick={onClose}
                      className={cn(
                        'group flex items-center gap-3 rounded-md px-3 py-2.5',
                        'text-[0.875rem] font-medium text-ink transition-colors',
                        'hover:bg-paper hover:text-brand'
                      )}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-paper text-ink-muted transition-colors group-hover:bg-brand-subtle group-hover:text-brand">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="truncate">{category.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <aside className="hidden border-t border-line bg-brand-subtle p-5 md:block md:border-l md:border-t-0">
          <p className="text-[0.8125rem] font-medium text-brand">Featured</p>
          <h3 className="mt-2 text-[1.0625rem] font-semibold leading-snug text-ink">
            Fresh arrivals from trusted vendors
          </h3>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
            Curated picks, trending collections, and top-rated finds.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href={PATHS.productsNewest}
              onClick={onClose}
              className="inline-flex text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
            >
              Shop new arrivals
            </Link>
            <Link
              href={PATHS.categories}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-ink transition-colors hover:text-brand"
            >
              Browse all categories <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
