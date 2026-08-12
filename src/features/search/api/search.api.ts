import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { SearchSuggestion } from '../types'

export const searchApi = {
  autocomplete: (term: string) =>
    apiClient.get<SearchSuggestion[]>(API.search.autocomplete(term)),
  search: async (term: string, page = 1) => {
    const res = await apiClient.getWithResponse<SearchSuggestion[]>(API.search.query(term, page))
    return unwrapPaginatedList(res)
  },
}
