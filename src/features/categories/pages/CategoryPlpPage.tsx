'use client'

import Link from 'next/link'
import { ArrowUpDown, ChevronRight, Columns2, Package, SlidersHorizontal } from 'lucide-react'
import { FilterSidebar } from '@/features/products/components/FilterSidebar'
import { SortBar } from '@/features/products/components/SortBar'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { ProductCompareBar } from '@/features/products/components/ProductCompareBar'
import { ProductCompareSection } from '@/features/products/components/ProductCompareSection'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { Button } from '@/shared/components/ui/button'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { EmptyState } from '@/shared/components/EmptyState'
import { SelectableOptionButton } from '@/shared/components/SelectableOptionButton'
import { Breadcrumbs } from '@/shared/components/Breadcrumbs'
import { useCategoryPlp } from '../hooks/useCategoryPlp'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { formatLabel } from '@/shared/utils/formatLabel'
import { cn } from '@/shared/utils/cn'

interface CategoryPlpPageProps {
  slugPath: string[]
}

export function CategoryPlpPage({ slugPath }: CategoryPlpPageProps) {
  const plp = useCategoryPlp(slugPath)

  if (plp.categoryLoading) {
    return (
      <div className="storefront-container py-4 md:py-5">
        <div className="h-4 w-40 animate-pulse rounded bg-paper" />
        <div className="mt-3 h-7 w-56 animate-pulse rounded bg-paper" />
        <div className="mt-6 h-64 animate-pulse rounded-md bg-paper" />
      </div>
    )
  }

  if (plp.categoryError || !plp.category) {
    return (
      <div className="storefront-container py-10 md:py-14">
        <EmptyState
          icon={Package}
          eyebrow={LABELS.shop}
          heading={LABELS.categoryNotFound}
          message={LABELS.categoryPlpEmpty}
          actionLabel={LABELS.allCategories}
          actionTo={PATHS.categories}
        />
      </div>
    )
  }

  const childLinks = plp.category.children ?? []
  const emptyIcon = plp.hasActiveFacets ? SlidersHorizontal : Package

  return (
    <div className="storefront-container pb-8 pt-3 sm:pt-4 md:pt-5">
      <header className="mb-3 sm:mb-4 md:mb-5">
        <Breadcrumbs items={plp.breadcrumbItems} className="mb-1.5 sm:mb-2" />

        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:gap-6 xl:gap-8">
          <div className="min-w-0 shrink-0 lg:max-w-[min(100%,22rem)] xl:max-w-[min(100%,28rem)]">
            <h1
              className="font-display font-semibold tracking-tight text-ink"
              style={{ fontSize: 'var(--text-h1)', lineHeight: 1.15 }}
            >
              {plp.category.name}
            </h1>
            {plp.category.seoDescription ? (
              <p
                className="mt-1 line-clamp-2 max-w-2xl text-ink-muted sm:line-clamp-none"
                style={{ fontSize: 'var(--text-body-sm)', lineHeight: 1.4 }}
              >
                {plp.category.seoDescription}
              </p>
            ) : null}
          </div>

          {childLinks.length > 0 ? (
            <nav
              aria-label={LABELS.shopInCategory}
              className="min-w-0 flex-1 lg:pt-0.5"
            >
              <p className="mb-1.5 text-eyebrow leading-none lg:text-right">
                {LABELS.shopInCategory}
              </p>
              <ul className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-4 pb-0.5 [scrollbar-width:none] touch-pan-x sm:mx-0 sm:px-0 lg:justify-end [&::-webkit-scrollbar]:hidden">
                {childLinks.map((child) => (
                  <li key={child.id} className="shrink-0">
                    <Link
                      href={PATHS.category(...slugPath, child.slug)}
                      title={formatLabel(LABELS.shopCategory, { name: child.name })}
                      aria-label={formatLabel(LABELS.shopCategory, { name: child.name })}
                      className={cn(
                        'group inline-flex h-8 items-center gap-0.5 rounded-md border border-line bg-surface px-2.5',
                        'text-[0.8125rem] font-medium text-ink shadow-[0_1px_0_rgba(15,23,42,0.04)]',
                        'transition-colors hover:border-brand hover:bg-brand-subtle hover:text-brand',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                      )}
                    >
                      <span>{child.name}</span>
                      <ChevronRight
                        className="h-3.5 w-3.5 text-ink-faint transition-colors group-hover:text-brand"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </header>

      <div className="sticky top-14 z-20 -mx-4 mb-3 border-y border-line bg-paper/95 px-4 py-2 backdrop-blur-sm xl:hidden lg:top-[72px]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button variant="secondary" size="sm" className="min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4" onClick={plp.openFilters}>
            <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
            <span className="truncate">{LABELS.filters}</span>
          </Button>
          <Button variant="secondary" size="sm" className="min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4" onClick={plp.openSort}>
            <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
            <span className="truncate">{LABELS.sort}</span>
          </Button>
          <Button
            variant={plp.compareMode ? 'default' : 'secondary'}
            size="sm"
            className="min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4"
            onClick={plp.toggleCompareMode}
            aria-pressed={plp.compareMode}
          >
            <Columns2 size={14} strokeWidth={1.75} aria-hidden />
            <span className="truncate">{LABELS.compare}</span>
          </Button>
        </div>
      </div>

      <div className="mb-12 flex gap-6 sm:mb-16 xl:mb-24 xl:gap-10">
        <FilterSidebar
          idPrefix="cat-desktop"
          minPrice={plp.filters.minPrice}
          maxPrice={plp.filters.maxPrice}
          rating={plp.filters.rating}
          facets={plp.facets}
          facetSelections={plp.facetSelections}
          onToggleFacet={plp.toggleFacetValue}
          onUpdateFilter={plp.updateFilter}
          onClear={plp.clearFilters}
        />

        <div className="min-w-0 flex-1">
          <SortBar
            sort={plp.filters.sort}
            totalProducts={plp.data?.total}
            isFetching={plp.isFetching}
            onSortChange={(v) => plp.updateFilter('sort', v)}
            compareMode={plp.compareMode}
            onToggleCompare={plp.toggleCompareMode}
            hideSortOnMobile
            className="mb-4 border-b-0 pb-0 xl:mb-6 xl:border-b xl:pb-4"
          />

          {!plp.data && plp.isFetching ? (
            <ProductGrid loading skeletonCount={12} />
          ) : plp.data?.items.length === 0 ? (
            <EmptyState
              icon={emptyIcon}
              eyebrow={
                plp.hasActiveFacets
                  ? LABELS.categoryPlpNoFilterMatchesEyebrow
                  : LABELS.categoryPlpEmptyEyebrow
              }
              heading={formatLabel(
                plp.hasActiveFacets
                  ? LABELS.categoryPlpNoFilterMatchesHeading
                  : LABELS.categoryPlpEmptyHeading,
                { name: plp.category.name },
              )}
              message={
                plp.hasActiveFacets
                  ? LABELS.categoryPlpNoFilterMatchesBody
                  : LABELS.categoryPlpEmptyBody
              }
              actionLabel={
                plp.hasActiveFacets ? LABELS.clearFacetFilters : LABELS.allCategories
              }
              actionTo={plp.hasActiveFacets ? undefined : PATHS.categories}
              onAction={plp.hasActiveFacets ? plp.clearFilters : undefined}
              secondaryAction={
                plp.hasActiveFacets
                  ? {
                      label: LABELS.allProducts,
                      href: PATHS.products,
                      variant: 'secondary',
                    }
                  : slugPath.length > 1
                    ? {
                        label: formatLabel(LABELS.browseParentCategory, {
                          name:
                            plp.breadcrumbItems[plp.breadcrumbItems.length - 2]?.label ??
                            LABELS.categories,
                        }),
                        href: PATHS.category(...slugPath.slice(0, -1)),
                        variant: 'secondary',
                      }
                    : {
                        label: LABELS.allProducts,
                        href: PATHS.products,
                        variant: 'secondary',
                      }
              }
              className="py-14 md:py-16"
            />
          ) : (
            <>
              <ProductGrid
                products={plp.data?.items}
                compareMode={plp.compareMode}
                comparedIds={plp.comparedIds}
                onToggleCompare={plp.toggleCompareProduct}
              />
              {plp.data && plp.data.totalPages > 1 ? (
                <PaginationContainer
                  currentPage={plp.filters.page ?? 1}
                  totalPages={plp.data.totalPages}
                  onPageChange={(p) => plp.updateFilter('page', p)}
                />
              ) : null}
            </>
          )}
        </div>
      </div>

      <BottomSheet open={plp.filterOpen} onClose={plp.closeFilters} title={LABELS.filters}>
        <FilterSidebar
          idPrefix="cat-mobile"
          className="w-full"
          minPrice={plp.filters.minPrice}
          maxPrice={plp.filters.maxPrice}
          rating={plp.filters.rating}
          facets={plp.facets}
          facetSelections={plp.facetSelections}
          onToggleFacet={plp.toggleFacetValue}
          onUpdateFilter={plp.updateFilter}
          onClear={() => {
            plp.clearFilters()
            plp.closeFilters()
          }}
        />
        <Button className="mt-4 w-full" onClick={plp.closeFilters}>
          {LABELS.showResults}
        </Button>
      </BottomSheet>

      <BottomSheet open={plp.sortOpen} onClose={plp.closeSort} title={LABELS.sort}>
        <div className="space-y-2">
          {plp.sortOptions.map((option) => (
            <SelectableOptionButton
              key={option.value}
              selected={plp.filters.sort === option.value}
              onClick={() => plp.selectSort(option.value)}
            >
              {option.label}
            </SelectableOptionButton>
          ))}
        </div>
      </BottomSheet>

      <ProductCompareBar
        products={plp.comparedProducts}
        onToggleProduct={plp.toggleCompareProduct}
        onClear={plp.clearComparedProducts}
        onCompareNow={plp.scrollToCompare}
      />

      <ProductCompareSection ref={plp.compareSectionRef} products={plp.comparedProducts} />
    </div>
  )
}
