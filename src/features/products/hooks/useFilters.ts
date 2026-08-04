import { useSearchParams, useRouter } from 'next/navigation'
import { parseFilters, filtersToParams } from '../utils/products.utils'

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filters = parseFilters(searchParams)

  const updateFilter = (key: string, value: unknown) => {
    const next = { ...filters, [key]: value || undefined }
    const params = filtersToParams(next)
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => router.push(window.location.pathname)

  return { filters, updateFilter, clearFilters }
}
