import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { UserStatus } from '@/shared/constants/statuses'
import type { CurrentUser } from '@/shared/api/types'

export const adminUsersApi = {
  list: async (
    params: PaginationQuery & { status?: string; roleId?: string; search?: string } = {},
  ): Promise<PaginatedList<CurrentUser>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.status) q.set('status', params.status)
    if (params.roleId) q.set('roleId', params.roleId)
    if (params.search) q.set('search', params.search)
    const res = await apiClient.getWithResponse<CurrentUser[]>(API.users.list(q.toString()))
    return unwrapPaginatedList(res)
  },
  getById: (id: string) => apiClient.get<CurrentUser>(API.users.detail(id)),
  updateStatus: (id: string, status: UserStatus) =>
    apiClient.patch<{ message: string }>(API.users.status(id), { status }),
  delete: (id: string) => apiClient.delete(API.users.detail(id)),
}
