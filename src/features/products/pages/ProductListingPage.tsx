'use client'

import { Columns2, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { FilterSidebar } from '@/features/products/components/FilterSidebar'
import { SortBar } from '@/features/products/components/SortBar'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { ProductCompareBar } from '@/features/products/components/ProductCompareBar'
import { ProductCompareSection } from '@/features/products/components/ProductCompareSection'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { Button } from '@/shared/components/ui/button'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { EmptyState } from '@/shared/components/EmptyState'
import { SORT_OPTIONS, useProductListing } from '../hooks/useProductListing'
import { cn } from '@/shared/utils/cn'

export function ProductListingPage() {
  const listing = useProductListing()

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-6 pb-8 md:pt-8">
      <h1 className="sr-only">All products</h1>

      <div className="lg:hidden sticky top-14 z-20 -mx-4 mb-6 border-y border-line-strong bg-paper/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={listing.openFilters}
          >
            <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
            Filters
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={listing.openSort}
          >
            <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
            Sort
          </Button>
          <Button
            variant={listing.compareMode ? 'default' : 'secondary'}
            size="sm"
            className="flex-1 gap-1.5"
            onClick={listing.toggleCompareMode}
            aria-pressed={listing.compareMode}
          >
            <Columns2 size={14} strokeWidth={1.75} aria-hidden />
            Compare
          </Button>
        </div>
      </div>

      <div className="mb-20 flex gap-10 lg:mb-28 lg:gap-12">
        <FilterSidebar
          idPrefix="desktop"
          minPrice={listing.filters.minPrice}
          maxPrice={listing.filters.maxPrice}
          rating={listing.filters.rating}
          onUpdateFilter={listing.updateFilter}
          onClear={listing.clearFilters}
        />

        <div className="min-w-0 flex-1">
          <SortBar
            sort={listing.filters.sort}
            totalProducts={listing.data?.total}
            isFetching={listing.isFetching}
            onSortChange={(v) => listing.updateFilter('sort', v)}
            compareMode={listing.compareMode}
            onToggleCompare={listing.toggleCompareMode}
          />

          {!listing.data && listing.isFetching ? (
            <ProductGrid loading skeletonCount={12} />
          ) : listing.data?.items.length === 0 ? (
            <EmptyState
              icon={SlidersHorizontal}
              eyebrow="Filters"
              heading="Nothing in this range"
              message="No pieces match these filters. Reset them to browse the full collection."
              actionLabel="Reset filters"
              onAction={listing.clearFilters}
            />
          ) : (
            <>
              <ProductGrid
                products={listing.data?.items}
                compareMode={listing.compareMode}
                comparedIds={listing.comparedIds}
                onToggleCompare={listing.toggleCompareProduct}
              />
              {listing.data && listing.data.totalPages > 1 && (
                <PaginationContainer
                  currentPage={listing.filters.page ?? 1}
                  totalPages={listing.data.totalPages}
                  onPageChange={(p) => listing.updateFilter('page', p)}
                />
              )}
            </>
          )}
        </div>
      </div>

      <BottomSheet open={listing.filterOpen} onClose={listing.closeFilters} title="Filters">
        <FilterSidebar
          idPrefix="mobile"
          className="w-full"
          minPrice={listing.filters.minPrice}
          maxPrice={listing.filters.maxPrice}
          rating={listing.filters.rating}
          onUpdateFilter={listing.updateFilter}
          onClear={() => {
            listing.clearFilters()
            listing.closeFilters()
          }}
        />
        <Button className="mt-4 w-full" onClick={listing.closeFilters}>
          Show results
        </Button>
      </BottomSheet>

      <BottomSheet open={listing.sortOpen} onClose={listing.closeSort} title="Sort">
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'h-11 w-full rounded-md border px-4 text-left text-[0.9375rem] transition-colors',
                listing.filters.sort === option.value
                  ? 'border-brand bg-brand-subtle font-medium text-brand'
                  : 'border-line bg-surface text-ink hover:bg-paper'
              )}
              onClick={() => listing.selectSort(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </BottomSheet>

      <ProductCompareBar
        products={listing.comparedProducts}
        onToggleProduct={listing.toggleCompareProduct}
        onClear={listing.clearComparedProducts}
        onCompareNow={listing.scrollToCompare}
      />

      <ProductCompareSection
        ref={listing.compareSectionRef}
        products={listing.comparedProducts}
      />
    </div>
  )
}
