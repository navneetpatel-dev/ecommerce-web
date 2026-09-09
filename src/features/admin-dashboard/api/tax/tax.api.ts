import { apiClient } from '@/shared/api/client/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/client/pagination'
import { API } from '@/shared/constants/apiRoutes'

export const taxApi = {
  getRules: async (params: PaginationQuery = {}): Promise<PaginatedList<Record<string, unknown>>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<Record<string, unknown>[]>(
      qs ? `${API.tax.rules}?${qs}` : API.tax.rules,
    )
    return unwrapPaginatedList(res)
  },
  createRule: (body: unknown) => apiClient.post<unknown>(API.tax.rules, body),
  updateRule: (id: string, body: unknown) => apiClient.patch<unknown>(API.tax.rule(id), body),
  deleteRule: (id: string) => apiClient.delete(API.tax.rule(id)),
}
