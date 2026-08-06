import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { ProductListItem } from '@/shared/api/types'

export const searchApi = {
  autocomplete: (term: string) =>
    apiClient.get<ProductListItem[]>(API.search.autocomplete(term)),
  search: (term: string, page = 1) =>
    apiClient.get<{ items: ProductListItem[]; total: number; totalPages: number }>(
      API.search.query(term, page)
    ),
}
