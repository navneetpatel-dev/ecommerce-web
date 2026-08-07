import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productsApi, type ProductFilters } from './products.api'

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (idOrSlug: string) => [...productKeys.all, 'detail', idOrSlug] as const,
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function fetchProduct(idOrSlug: string) {
  return UUID_RE.test(idOrSlug)
    ? productsApi.detail(idOrSlug)
    : productsApi.detailBySlug(idOrSlug)
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: productKeys.detail(idOrSlug),
    queryFn: () => fetchProduct(idOrSlug),
    enabled: !!idOrSlug,
  })
}

export function useProductList(
  filters: ProductFilters,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.list(filters),
    placeholderData: (prev) => prev,
    enabled: options.enabled ?? true,
  })
}

export function usePrefetchProduct() {
  const queryClient = useQueryClient()
  return (idOrSlug: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(idOrSlug),
      queryFn: () => fetchProduct(idOrSlug),
    })
  }
}
