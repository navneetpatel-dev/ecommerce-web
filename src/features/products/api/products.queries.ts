import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productsApi, type ProductFilters } from './products.api'

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.detail(id),
    enabled: !!id,
  })
}

export function useProductList(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.list(filters),
    placeholderData: (prev) => prev,
  })
}

export function usePrefetchProduct() {
  const queryClient = useQueryClient()
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => productsApi.detail(id),
    })
  }
}
