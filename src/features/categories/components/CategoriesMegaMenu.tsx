'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import { categoryHref, resolveCategoryIcon } from '../utils/categoryHelpers'
import type { Category } from '@/shared/api/types'

interface CategoriesMegaMenuProps {
  categories: Category[]
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
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
  const count = categories.length

  return (
    <div
      className="absolute left-0 top-full mt-3 w-[min(960px,calc(100vw-2rem))] overflow-hidden rounded-md border border-line bg-surface-raised shadow-elevation-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <div>
          <p className="text-[0.8125rem] font-semibold text-ink">{LABELS.allCategories}</p>
          <p className="mt-0.5 text-[0.75rem] text-ink-muted">
            {count === 0 ? LABELS.categoryPlpEmpty : `${count}`}
          </p>
        </div>
        <Link
          href={PATHS.categories}
          onClick={onClose}
          className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-brand transition-colors hover:text-brand-hover"
        >
          {LABELS.allCategories} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="max-h-[min(60vh,480px)] overflow-y-auto overscroll-contain p-3 md:p-4">
          {count === 0 ? (
            <p className="px-2 py-8 text-center text-[0.9375rem] text-ink-muted">
              {LABELS.categoryPlpEmpty}
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((department) => {
                const Icon = resolveCategoryIcon(department)
                return (
                  <li key={department.id} className="min-w-0">
                    <Link
                      href={categoryHref(department, categories)}
                      onClick={onClose}
                      className="group mb-2 flex items-center gap-2 text-[0.875rem] font-semibold text-ink hover:text-brand"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-paper text-ink-muted group-hover:bg-brand-subtle group-hover:text-brand">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="truncate">{department.name}</span>
                    </Link>
                    {department.children?.length ? (
                      <ul className="space-y-1.5 border-l border-line pl-3">
                        {department.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={categoryHref(child, categories)}
                              onClick={onClose}
                              className="block truncate text-[0.8125rem] font-medium text-ink-muted hover:text-brand"
                            >
                              {child.name}
                            </Link>
                            {child.children?.length ? (
                              <ul className="mt-1 space-y-1 pl-2">
                                {child.children.map((leaf) => (
                                  <li key={leaf.id}>
                                    <Link
                                      href={categoryHref(leaf, categories)}
                                      onClick={onClose}
                                      className={cn(
                                        'block truncate text-[0.75rem] text-ink-faint hover:text-brand',
                                      )}
                                    >
                                      {leaf.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <aside className="hidden border-t border-line bg-brand-subtle p-5 md:block md:border-l md:border-t-0">
          <p className="text-[0.8125rem] font-medium text-brand">{LABELS.featured}</p>
          <Link
            href={PATHS.productsNewest}
            onClick={onClose}
            className="mt-4 inline-flex text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
          >
            {LABELS.shopNewArrivals}
          </Link>
        </aside>
      </div>
    </div>
  )
}
