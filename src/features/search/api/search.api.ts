import { apiClient } from '@/shared/api/client'
import type { ProductListItem } from '@/shared/api/types'

export const searchApi = {
  autocomplete: (term: string) =>
    apiClient.get<ProductListItem[]>(`/api/search/autocomplete?q=${encodeURIComponent(term)}`),
  search: (term: string, page = 1) =>
    apiClient.get<{ items: ProductListItem[]; total: number; totalPages: number }>(
      `/api/search?q=${encodeURIComponent(term)}&page=${page}`
    ),
}
