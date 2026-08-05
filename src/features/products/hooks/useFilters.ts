import { useSearchParams, useRouter } from 'next/navigation'
import { parseFilters, filtersToParams, clearFacetFilters } from '../utils/products.utils'
import { navigate } from '@/shared/utils/navigate'
import type { ProductFilters } from '../api/products.api'

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filters = parseFilters(searchParams)

  const pushFilters = (next: ProductFilters | Record<string, unknown>) => {
    const params = filtersToParams(next as Record<string, unknown>)
    const query = params.toString()
    navigate(router, query ? `?${query}` : window.location.pathname)
  }

  const updateFilter = (key: string, value: unknown) => {
    const next = {
      ...filters,
      [key]: value === '' || value === null || value === undefined ? undefined : value,
      ...(key !== 'page' ? { page: 1 } : {}),
    }
    pushFilters(next)
  }

  const clearFilters = () => {
    pushFilters(clearFacetFilters(filters))
  }

  return { filters, updateFilter, clearFilters }
}
