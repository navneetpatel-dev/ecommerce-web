'use client'
import { useFilters } from '../hooks/useFilters'
import { useProductList } from '../api/products.queries'
import { FilterSidebar } from '../components/FilterSidebar'
import { SortBar } from '../components/SortBar'
import { ProductGrid } from '../components/ProductGrid'
import { Pagination } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { useState } from 'react'

export function ProductListingPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const { filters, updateFilter, clearFilters } = useFilters()
  const { data, isFetching } = useProductList(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="lg:hidden sticky top-14 z-20 bg-paper border-y border-line mb-4 -mx-4 px-4 py-3 flex items-center gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => setFilterOpen(true)}>
          Filters
        </Button>
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSortOpen(true)}>
          Sort
        </Button>
      </div>

      <div className="flex gap-8">
        <FilterSidebar minPrice={filters.minPrice} maxPrice={filters.maxPrice} rating={undefined} onUpdateFilter={updateFilter} onClear={clearFilters} />
        <div className="flex-1 min-w-0">
          <SortBar sort={filters.sort} totalProducts={data?.total} isFetching={isFetching} onSortChange={(v) => updateFilter('sort', v)} />

          {!data && isFetching ? (
            <ProductGrid loading skeletonCount={12} />
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink/50 text-lg mb-4">No products match these filters</p>
              <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
            </div>
          ) : (
            <>
              <ProductGrid products={data?.items} />
              {data && data.totalPages > 1 && (
                <Pagination currentPage={filters.page} totalPages={data.totalPages} onPageChange={(p) => updateFilter('page', p)} />
              )}
            </>
          )}
        </div>
      </div>

      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <FilterSidebar
          className="w-full"
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          rating={undefined}
          onUpdateFilter={updateFilter}
          onClear={clearFilters}
        />
        <Button className="w-full mt-4" onClick={() => setFilterOpen(false)}>
          Show results
        </Button>
      </BottomSheet>

      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort">
        <div className="space-y-2">
          {[
            { value: 'trending', label: 'Trending' },
            { value: 'newest', label: 'Newest' },
            { value: 'price_asc', label: 'Price Low to High' },
            { value: 'price_desc', label: 'Price High to Low' },
            { value: 'rating', label: 'Top Rated' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full text-left h-11 px-4 rounded-sm border ${
                filters.sort === option.value ? 'border-brand bg-brand-subtle text-brand' : 'border-line bg-surface text-ink'
              }`}
              onClick={() => {
                updateFilter('sort', option.value)
                setSortOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
