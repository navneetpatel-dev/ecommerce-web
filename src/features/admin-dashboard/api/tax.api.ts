import { apiClient } from '@/shared/api/client'

export const taxApi = {
  getRules: () => apiClient.get<unknown[]>('/api/tax/rules'),
  createRule: (body: unknown) => apiClient.post<unknown>('/api/tax/rules', body),
  updateRule: (id: string, body: unknown) => apiClient.patch<unknown>(`/api/tax/rules/${id}`, body),
  deleteRule: (id: string) => apiClient.delete(`/api/tax/rules/${id}`),
}
