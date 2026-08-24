import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { ReturnRequest } from '@/shared/api/types'

export type CreateReturnBody = {
  orderItemId: string
  reasonCode: ReturnRequest['reasonCode']
  reason: string
  photoUrls?: string[]
}

export const returnsApi = {
  list: () => apiClient.get<ReturnRequest[]>(API.returns.list),
  listAdmin: async (params: PaginationQuery = {}): Promise<PaginatedList<ReturnRequest>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<ReturnRequest[]>(
      qs ? `${API.returns.admin}?${qs}` : API.returns.admin,
    )
    return unwrapPaginatedList(res)
  },
  create: (body: CreateReturnBody) => apiClient.post<ReturnRequest>(API.returns.create, body),
  get: (id: string) => apiClient.get<ReturnRequest>(API.returns.detail(id)),
  transition: (id: string, status: ReturnRequest['status']) =>
    apiClient.patch<{ message: string }>(API.returns.transition(id), { status }),
  delete: (id: string) => apiClient.delete(API.returns.delete(id)),
}
