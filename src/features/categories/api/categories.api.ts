import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { Category } from '@/shared/api/types'

export const categoriesApi = {
  /** Storefront / pickers — full category tree (no pagination). */
  list: () => apiClient.get<Category[]>(API.categories.list),

  /** Admin table — paginated flat top-level categories. */
  listPaginated: async (params: PaginationQuery = {}): Promise<PaginatedList<Category>> => {
    const q = new URLSearchParams()
    q.set('page', String(params.page ?? 1))
    if (params.limit) q.set('limit', String(params.limit))
    const res = await apiClient.getWithResponse<Category[]>(`${API.categories.list}?${q.toString()}`)
    return unwrapPaginatedList(res)
  },

  detail: (id: string) => apiClient.get<Category>(API.categories.detail(id)),
  create: (body: { name: string; parentId?: string }) =>
    apiClient.post<Category>(API.categories.list, body),
  update: (id: string, body: { name?: string; parentId?: string | null }) =>
    apiClient.patch<Category>(API.categories.detail(id), body),
  delete: (id: string) => apiClient.delete(API.categories.detail(id)),
}
