'use client'
import { useFilters } from '../hooks/useFilters'
import { useProductList } from '../api/products.queries'
import { FilterSidebar } from '../components/FilterSidebar'
import { SortBar } from '../components/SortBar'
import { ProductGrid } from '../components/ProductGrid'
import { Pagination } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { useRef, useState } from 'react'
import type { ProductListItem } from '@/shared/api/types'

export function ProductListingPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [comparedProducts, setComparedProducts] = useState<ProductListItem[]>([])
  const compareSectionRef = useRef<HTMLElement>(null)
  const { filters, updateFilter, clearFilters } = useFilters()
  const { data, isFetching } = useProductList(filters)

  const toggleCompareProduct = (product: ProductListItem) => {
    setComparedProducts((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id)
      }

      if (current.length >= 4) {
        return current
      }

      return [...current, product]
    })
  }

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
          <div className="flex items-center justify-between gap-4">
            <SortBar sort={filters.sort} totalProducts={data?.total} isFetching={isFetching} onSortChange={(v) => updateFilter('sort', v)} />
            <Button
              type="button"
              variant={compareMode ? 'default' : 'secondary'}
              size="sm"
              className="hidden lg:inline-flex"
              onClick={() => setCompareMode((value) => !value)}
            >
              Compare
            </Button>
          </div>

          {!data && isFetching ? (
            <ProductGrid loading skeletonCount={12} />
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[1.0625rem] text-ink-muted mb-4">No products match these filters</p>
              <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
            </div>
          ) : (
            <>
              <ProductGrid
                products={data?.items}
                compareMode={compareMode}
                comparedIds={comparedProducts.map((item) => item.id)}
                onToggleCompare={toggleCompareProduct}
              />
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

      {comparedProducts.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {comparedProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="rounded-full bg-brand-subtle px-3 py-1 text-[0.8125rem] font-medium text-brand"
                  onClick={() => toggleCompareProduct(product)}
                >
                  {product.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setComparedProducts([])}>
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={comparedProducts.length < 2}
                onClick={() => compareSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Compare now
              </Button>
            </div>
          </div>
        </div>
      )}

      {comparedProducts.length >= 2 && (
        <section ref={compareSectionRef} className="mt-12 rounded-lg border border-line bg-surface p-6">
          <div className="mb-6">
            <h2 className="text-[1.375rem] font-semibold text-ink">Product comparison</h2>
            <p className="mt-1 text-[0.9375rem] text-ink-muted">
              Review price, rating, stock, and vendor details side by side.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {comparedProducts.map((product) => (
              <article key={product.id} className="rounded-md border border-line bg-paper p-4">
                <h3 className="text-[1rem] font-medium text-ink">{product.name}</h3>
                <dl className="mt-4 space-y-3 text-[0.9375rem]">
                  <div>
                    <dt className="text-ink-muted">Price</dt>
                    <dd className="font-medium text-brand">₹{product.basePrice.toLocaleString('en-IN')}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Rating</dt>
                    <dd className="text-ink">{product.avgRating.toFixed(1)} / 5</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Reviews</dt>
                    <dd className="text-ink">{product.reviewCount}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Stock</dt>
                    <dd className="text-ink">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Vendor</dt>
                    <dd className="text-ink">{product.vendor?.businessName ?? 'Marketplace vendor'}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
