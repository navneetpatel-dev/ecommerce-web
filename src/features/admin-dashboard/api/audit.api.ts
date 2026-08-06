import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export const auditApi = {
  list: () => apiClient.get<unknown[]>(API.audit.list),
}
