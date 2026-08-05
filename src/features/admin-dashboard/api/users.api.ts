import { apiClient } from '@/shared/api/client'
import type { CurrentUser } from '@/shared/api/types'

export const adminUsersApi = {
  list: async (params?: { page?: number; status?: string; roleId?: string; search?: string }) => {
    const q = new URLSearchParams()
    if (params?.page) q.set('page', String(params.page))
    if (params?.status) q.set('status', params.status)
    if (params?.roleId) q.set('roleId', params.roleId)
    if (params?.search) q.set('search', params.search)
    const res = await apiClient.getWithResponse<CurrentUser[]>(`/api/users?${q}`)
    const pagination = res.meta?.pagination as { total?: number; totalPages?: number } | undefined
    return {
      items: Array.isArray(res.data) ? res.data : [],
      total: pagination?.total ?? 0,
      totalPages: pagination?.totalPages ?? 1,
    }
  },
  getById: (id: string) => apiClient.get<CurrentUser>(`/api/users/${id}`),
  updateStatus: (id: string, status: 'ACTIVE' | 'BLOCKED') =>
    apiClient.patch<{ message: string }>(`/api/users/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete(`/api/users/${id}`),
}
