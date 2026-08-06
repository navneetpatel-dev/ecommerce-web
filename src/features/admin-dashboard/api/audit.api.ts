import { apiClient } from '@/shared/api/client'

export const auditApi = {
  list: () => apiClient.get<unknown[]>('/api/audit'),
}
