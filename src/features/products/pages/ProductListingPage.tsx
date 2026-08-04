'use client'
import { useFilters } from '../hooks/useFilters'
import { useProductList } from '../api/products.queries'
import { FilterSidebar } from '../components/FilterSidebar'
import { SortBar } from '../components/SortBar'
import { ProductGrid } from '../components/ProductGrid'
import { Pagination } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'

export function ProductListingPage() {
  const { filters, updateFilter, clearFilters } = useFilters()
  const { data, isFetching } = useProductList(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <FilterSidebar minPrice={filters.minPrice} maxPrice={filters.maxPrice} onUpdateFilter={updateFilter} onClear={clearFilters} />
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
    </div>
  )
}
