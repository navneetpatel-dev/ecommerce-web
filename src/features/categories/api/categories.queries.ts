import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from './categories.api'

export function useCategories(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
    staleTime: 1000 * 60 * 5,
    enabled: options.enabled ?? true,
  })
}
