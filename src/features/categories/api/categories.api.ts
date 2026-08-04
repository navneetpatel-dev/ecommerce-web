import { apiClient } from '@/shared/api/client'
import type { Category } from '@/shared/api/types'

export const categoriesApi = {
  list: () => apiClient.get<Category[]>('/api/categories'),
  detail: (id: string) => apiClient.get<Category>(`/api/categories/${id}`),
  create: (body: { name: string; slug: string; parentId?: string }) =>
    apiClient.post<Category>('/api/categories', body),
  update: (id: string, body: { name?: string; slug?: string; parentId?: string | null }) =>
    apiClient.patch<Category>(`/api/categories/${id}`, body),
  delete: (id: string) => apiClient.delete(`/api/categories/${id}`),
}
