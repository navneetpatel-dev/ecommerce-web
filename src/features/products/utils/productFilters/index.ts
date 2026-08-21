import type { ProductFilters } from '../../api/products.api'

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function parseFilters(params: URLSearchParams): ProductFilters {
  return {
    categoryId: params.get('categoryId') || undefined,
    vendorId: params.get('vendorId') || undefined,
    search: params.get('search') || undefined,
    minPrice: parseOptionalNumber(params.get('minPrice')),
    maxPrice: parseOptionalNumber(params.get('maxPrice')),
    rating: parseOptionalNumber(params.get('rating')),
    sort: params.get('sort') || undefined,
    page: parseOptionalNumber(params.get('page')) || 1,
    limit: 20,
  }
}

export function filtersToParams(filters: Record<string, unknown>) {
  const p = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '' || k === 'limit') return
    if (k === 'page' && v === 1) return
    p.set(k, String(v))
  })
  return p
}

/** Clears price/rating facets; keeps category, vendor, sort, and search. */
export function clearFacetFilters(filters: ProductFilters): ProductFilters {
  return {
    categoryId: filters.categoryId,
    vendorId: filters.vendorId,
    sort: filters.sort,
    search: filters.search,
    page: 1,
    limit: filters.limit ?? 20,
  }
}
