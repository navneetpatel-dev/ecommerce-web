import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export const notificationsApi = {
  logs: () => apiClient.get<unknown[]>(API.notifications.logs),
  sendTest: () => apiClient.post<{ message: string }>(API.notifications.test, {}),
}
