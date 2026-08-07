'use client'

import Link from 'next/link'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { CategoryCard } from './CategoryCard'
import { CategoriesPageSkeleton } from '@/shared/components/Skeletons'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { categoryHref, resolveCategoryIcon } from '../utils/categoryHelpers'
import type { Category } from '@/shared/api/types'
import type { CategoryRootWithChildren } from '../hooks/useCategoriesPage'
import { cn } from '@/shared/utils/cn'

interface CategoriesViewProps {
  roots: Category[]
  rootsWithChildren: CategoryRootWithChildren[]
  tree: Category[]
  isLoading?: boolean
  isEmpty?: boolean
}

export function CategoriesView({
  roots,
  rootsWithChildren,
  tree,
  isLoading,
  isEmpty,
}: CategoriesViewProps) {
  if (isLoading) return <CategoriesPageSkeleton />

  return (
    <div className="storefront-container py-10 md:py-14">
      <div className="mb-10 max-w-2xl">
        <TextEyebrow className="mb-2">{LABELS.browse}</TextEyebrow>
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-ink md:text-[2.5rem]">
          {LABELS.allCategories}
        </h1>
        <p className="mt-3 text-[1.0625rem] text-ink-muted">
          {formatLabel(LABELS.categoriesIndexHint, { site: LABELS.brandName })}
        </p>
      </div>

      {isEmpty ? (
        <div className="rounded-md border border-line bg-surface px-6 py-16 text-center">
          <LayoutGrid className="mx-auto h-8 w-8 text-ink-faint" strokeWidth={1.25} />
          <p className="mt-4 text-[1.0625rem] font-medium text-ink">{LABELS.noCategoriesYet}</p>
          <Link href={PATHS.products} className="mt-3 inline-flex items-center gap-1 text-[0.9375rem] text-brand">
            {LABELS.browseProducts} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
            {roots.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                href={categoryHref(category, tree)}
              />
            ))}
          </div>

          {rootsWithChildren.length > 0 ? (
            <div className="space-y-10 border-t border-line pt-10">
              <div>
                <TextEyebrow className="mb-2">{LABELS.digDeeper}</TextEyebrow>
                <h2 className="text-[1.375rem] font-semibold text-ink">{LABELS.subcategories}</h2>
              </div>
              {rootsWithChildren.map(({ root, children }) => (
                <div key={root.id}>
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h3 className="text-[1.0625rem] font-semibold text-ink">{root.name}</h3>
                    <Link
                      href={categoryHref(root, tree)}
                      className="text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
                    >
                      {LABELS.shopAll}
                    </Link>
                  </div>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {children.map((child) => {
                      const Icon = resolveCategoryIcon(child)
                      return (
                        <li key={child.id}>
                          <Link
                            href={categoryHref(child, tree)}
                            className={cn(
                              'flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3',
                              'text-[0.9375rem] font-medium text-ink transition-colors',
                              'hover:border-brand hover:text-brand'
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.5} />
                            <span className="truncate">{child.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
