import { apiClient } from '@/shared/api/client'

export const notificationsApi = {
  logs: () => apiClient.get<unknown[]>('/api/notifications/logs'),
  sendTest: () => apiClient.post<{ message: string }>('/api/notifications/test', {}),
}
