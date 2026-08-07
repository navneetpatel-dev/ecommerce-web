'use client'

import Link from 'next/link'
import { ArrowUpDown, Columns2, Package, SlidersHorizontal } from 'lucide-react'
import { FilterSidebar } from '@/features/products/components/FilterSidebar'
import { SortBar } from '@/features/products/components/SortBar'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { ProductCompareBar } from '@/features/products/components/ProductCompareBar'
import { ProductCompareSection } from '@/features/products/components/ProductCompareSection'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { Button } from '@/shared/components/ui/button'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { EmptyState } from '@/shared/components/EmptyState'
import { Breadcrumbs } from '@/shared/components/Breadcrumbs'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { useCategoryPlp } from '../hooks/useCategoryPlp'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { SITE } from '@/shared/seo/constants'
import { formatLabel } from '@/shared/utils/formatLabel'
import { cn } from '@/shared/utils/cn'

interface CategoryPlpPageProps {
  slugPath: string[]
}

export function CategoryPlpPage({ slugPath }: CategoryPlpPageProps) {
  const plp = useCategoryPlp(slugPath)

  if (plp.categoryLoading) {
    return (
      <div className="storefront-container py-10 md:py-14">
        <div className="h-8 w-48 animate-pulse rounded bg-paper" />
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
    <div className="storefront-container pb-8 pt-6 md:pt-8">
      <Breadcrumbs items={plp.breadcrumbItems} className="mb-6" />

      <div className="mb-8 max-w-2xl">
        <TextEyebrow className="mb-2">{LABELS.shop}</TextEyebrow>
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-ink md:text-[2.5rem]">
          {plp.category.name}
        </h1>
        {plp.category.seoDescription ? (
          <p className="mt-3 text-[1.0625rem] text-ink-muted">{plp.category.seoDescription}</p>
        ) : null}
      </div>

      {childLinks.length > 0 ? (
        <ul className="mb-8 flex flex-wrap gap-2">
          {childLinks.map((child) => (
            <li key={child.id}>
              <Link
                href={PATHS.category(...slugPath, child.slug)}
                className="inline-flex rounded-md border border-line bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="sticky top-14 z-20 -mx-4 mb-6 border-y border-line bg-paper/95 px-4 py-3 backdrop-blur-sm xl:hidden lg:top-[72px]">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="flex-1 gap-1.5" onClick={plp.openFilters}>
            <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.filters}
          </Button>
          <Button variant="secondary" size="sm" className="flex-1 gap-1.5" onClick={plp.openSort}>
            <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.sort}
          </Button>
          <Button
            variant={plp.compareMode ? 'default' : 'secondary'}
            size="sm"
            className="flex-1 gap-1.5"
            onClick={plp.toggleCompareMode}
            aria-pressed={plp.compareMode}
          >
            <Columns2 size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.compare}
          </Button>
        </div>
      </div>

      <div className="mb-20 flex gap-10 xl:mb-28 xl:gap-12">
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
          />

          {!plp.data && plp.isFetching ? (
            <ProductGrid loading skeletonCount={12} />
          ) : plp.data?.items.length === 0 ? (
            <EmptyState
              icon={emptyIcon}
              eyebrow={plp.hasActiveFacets ? LABELS.filters : LABELS.shop}
              heading={plp.hasActiveFacets ? LABELS.clearFacetFilters : LABELS.categoryPlpEmpty}
              message={
                plp.hasActiveFacets
                  ? LABELS.facetDisabledHint
                  : formatLabel(LABELS.shopCategoryDescription, {
                      name: plp.category.name,
                      site: SITE.name,
                    })
              }
              actionLabel={plp.hasActiveFacets ? LABELS.clearFacetFilters : LABELS.allProducts}
              actionTo={plp.hasActiveFacets ? undefined : PATHS.products}
              onAction={plp.hasActiveFacets ? plp.clearFilters : undefined}
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
            <button
              key={option.value}
              type="button"
              className={cn(
                'h-11 w-full rounded-md border px-4 text-left text-[0.9375rem] transition-colors',
                plp.filters.sort === option.value
                  ? 'border-brand bg-brand-subtle font-medium text-brand'
                  : 'border-line bg-surface text-ink hover:bg-paper',
              )}
              onClick={() => plp.selectSort(option.value)}
            >
              {option.label}
            </button>
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
