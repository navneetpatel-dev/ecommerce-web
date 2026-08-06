import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'

export const auditApi = {
  list: async (params: PaginationQuery = {}): Promise<PaginatedList<Record<string, unknown>>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<Record<string, unknown>[]>(
      qs ? `${API.audit.list}?${qs}` : API.audit.list,
    )
    return unwrapPaginatedList(res)
  },
}
