import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export const taxApi = {
  getRules: () => apiClient.get<unknown[]>(API.tax.rules),
  createRule: (body: unknown) => apiClient.post<unknown>(API.tax.rules, body),
  updateRule: (id: string, body: unknown) => apiClient.patch<unknown>(API.tax.rule(id), body),
  deleteRule: (id: string) => apiClient.delete(API.tax.rule(id)),
}
