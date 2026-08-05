'use client'

import { FilterSidebar } from '@/features/products/components/FilterSidebar'
import { SortBar } from '@/features/products/components/SortBar'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { ProductCompareBar } from '@/features/products/components/ProductCompareBar'
import { ProductCompareSection } from '@/features/products/components/ProductCompareSection'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { Button } from '@/shared/components/ui/button'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { SORT_OPTIONS, useProductListing } from '../hooks/useProductListing'

export function ProductListingPage() {
  const listing = useProductListing()

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
      <div className="lg:hidden sticky top-14 z-20 bg-paper border-y border-line mb-4 -mx-4 px-4 py-3 flex items-center gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={listing.openFilters}>
          Filters
        </Button>
        <Button variant="secondary" size="sm" className="flex-1" onClick={listing.openSort}>
          Sort
        </Button>
        <Button
          variant={listing.compareMode ? 'default' : 'secondary'}
          size="sm"
          className="flex-1"
          onClick={listing.toggleCompareMode}
        >
          Compare
        </Button>
      </div>

      <div className="flex gap-8 mb-20 lg:mb-28">
        <FilterSidebar
          idPrefix="desktop"
          minPrice={listing.filters.minPrice}
          maxPrice={listing.filters.maxPrice}
          rating={listing.filters.rating}
          onUpdateFilter={listing.updateFilter}
          onClear={listing.clearFilters}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <SortBar
              sort={listing.filters.sort}
              totalProducts={listing.data?.total}
              isFetching={listing.isFetching}
              onSortChange={(v) => listing.updateFilter('sort', v)}
            />
            <Button
              type="button"
              variant={listing.compareMode ? 'default' : 'secondary'}
              size="sm"
              className="hidden lg:inline-flex"
              onClick={listing.toggleCompareMode}
            >
              Compare
            </Button>
          </div>

          {!listing.data && listing.isFetching ? (
            <ProductGrid loading skeletonCount={12} />
          ) : listing.data?.items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[1.0625rem] text-ink-muted mb-4">No products match these filters</p>
              <Button variant="outline" onClick={listing.clearFilters}>Clear all filters</Button>
            </div>
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
        <Button className="w-full mt-4" onClick={listing.closeFilters}>
          Show results
        </Button>
      </BottomSheet>

      <BottomSheet open={listing.sortOpen} onClose={listing.closeSort} title="Sort">
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full text-left h-11 px-4 rounded-sm border ${
                listing.filters.sort === option.value
                  ? 'border-brand bg-brand-subtle text-brand'
                  : 'border-line bg-surface text-ink'
              }`}
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
