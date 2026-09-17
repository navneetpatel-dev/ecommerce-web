import type { ProductFilters } from '../../../api/listing/products.api'

export const FILTER_RESERVED_PARAMS = new Set([
  'categoryId',
  'vendorId',
  'search',
  'minPrice',
  'maxPrice',
  'rating',
  'sort',
  'page',
  'limit',
  'status',
  'includeDescendants',
  'excludeProductId',
])

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

/** Read repeated query keys (no comma-join) into a facet map. */
export function parseFacetSelections(
  params: URLSearchParams,
): Record<string, string[]> {
  const selected: Record<string, string[]> = {}
  const seen = new Set<string>()
  for (const key of params.keys()) {
    if (seen.has(key) || FILTER_RESERVED_PARAMS.has(key)) continue
    seen.add(key)
    const values = params
      .getAll(key)
      .map((part) => part.trim())
      .filter(Boolean)
    if (values.length > 0) selected[key] = values
  }
  return selected
}

/** Write one facet as repeated keys so values may contain commas. */
export function writeRepeatedSearchParam(
  params: URLSearchParams,
  key: string,
  values: string[],
) {
  params.delete(key)
  for (const value of values) {
    const next = value.trim()
    if (next) params.append(key, next)
  }
}

export function parseFilters(params: URLSearchParams): ProductFilters {
  const attrs = parseFacetSelections(params)
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
    attrs: Object.keys(attrs).length > 0 ? attrs : undefined,
  }
}

export function filtersToParams(filters: Record<string, unknown>) {
  const p = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '' || k === 'limit') return
    if (k === 'page' && v === 1) return
    if (k === 'attrs' && typeof v === 'object' && !Array.isArray(v)) {
      for (const [attrKey, values] of Object.entries(
        v as Record<string, unknown>,
      )) {
        if (!Array.isArray(values)) continue
        writeRepeatedSearchParam(
          p,
          attrKey,
          values.map((item) => String(item)),
        )
      }
      return
    }
    p.set(k, String(v))
  })
  return p
}

/** Clears price/rating/attribute facets; keeps category, vendor, sort, and search. */
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
