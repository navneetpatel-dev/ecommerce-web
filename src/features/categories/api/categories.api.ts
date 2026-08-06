import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { Category } from '@/shared/api/types'

export const categoriesApi = {
  list: () => apiClient.get<Category[]>(API.categories.list),
  detail: (id: string) => apiClient.get<Category>(API.categories.detail(id)),
  create: (body: { name: string; parentId?: string }) =>
    apiClient.post<Category>(API.categories.list, body),
  update: (id: string, body: { name?: string; parentId?: string | null }) =>
    apiClient.patch<Category>(API.categories.detail(id), body),
  delete: (id: string) => apiClient.delete(API.categories.detail(id)),
}
