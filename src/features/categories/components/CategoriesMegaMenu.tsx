'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { MediaImage } from '@/shared/components/MediaImage'
import {
  categoryHref,
  resolveCategoryIcon,
  resolveCategoryImageUrl,
} from '../utils/categoryHelpers'
import type { Category } from '@/shared/api/types'

interface CategoriesMegaMenuProps {
  categories: Category[]
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const MAX_VISIBLE_CHILDREN = 5

function CategoryMegaMenuTile({
  department,
  tree,
  onClose,
}: {
  department: Category
  tree: Category[]
  onClose: () => void
}) {
  const Icon = resolveCategoryIcon(department)
  const imageUrl = resolveCategoryImageUrl(department)
  const children = department.children ?? []
  const visibleChildren = children.slice(0, MAX_VISIBLE_CHILDREN)
  const hiddenCount = Math.max(0, children.length - visibleChildren.length)

  return (
    <li className="min-w-0">
      <div
        className={cn(
          'group/tile h-full rounded-lg border border-line bg-paper/40 p-3 transition-all duration-200',
          'hover:border-brand/30 hover:bg-paper hover:shadow-elevation-1',
        )}
      >
        <Link
          href={categoryHref(department, tree)}
          onClick={onClose}
          className="mb-3 flex items-start gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-subtle text-brand transition-colors group-hover/tile:bg-brand group-hover/tile:text-paper">
            {imageUrl ? (
              <MediaImage
                src={imageUrl}
                alt=""
                unavailableLabel={formatLabel(LABELS.categoryImageUnavailable, {
                  name: department.name,
                })}
                sizes="44px"
                imageClassName="object-cover"
                className="absolute inset-0"
              />
            ) : (
              <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            )}
          </span>
          <span className="min-w-0 flex-1 pt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[0.875rem] font-semibold text-ink transition-colors group-hover/tile:text-brand">
                {department.name}
              </span>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-all group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:opacity-100 group-hover/tile:text-brand"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            {children.length ? (
              <span className="mt-0.5 block text-[0.6875rem] text-ink-faint">
                {formatLabel(
                  children.length === 1
                    ? LABELS.categoryChildCountSingular
                    : LABELS.categoryChildCountPlural,
                  { count: children.length },
                )}
              </span>
            ) : null}
          </span>
        </Link>

        {visibleChildren.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {visibleChildren.map((child) => (
              <li key={child.id}>
                <Link
                  href={categoryHref(child, tree)}
                  onClick={onClose}
                  className={cn(
                    'inline-flex max-w-full items-center rounded-full border border-line bg-surface px-2.5 py-1',
                    'text-[0.6875rem] font-medium text-ink-muted transition-colors',
                    'hover:border-brand/25 hover:bg-brand-subtle hover:text-brand',
                  )}
                >
                  <span className="truncate">{child.name}</span>
                </Link>
              </li>
            ))}
            {hiddenCount > 0 ? (
              <li>
                <Link
                  href={categoryHref(department, tree)}
                  onClick={onClose}
                  className="inline-flex items-center rounded-full px-2 py-1 text-[0.6875rem] font-medium text-brand hover:underline"
                >
                  +{hiddenCount}
                </Link>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </li>
  )
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
      className="absolute left-0 top-full z-50 mt-3 w-[min(980px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface-raised shadow-elevation-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/50 px-4 py-3.5 sm:px-5">
        <div>
          <p className="text-[0.875rem] font-semibold text-ink">{LABELS.allCategories}</p>
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
  )
}
