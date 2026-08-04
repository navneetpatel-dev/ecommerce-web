import { apiClient } from '@/shared/api/client'

export const couponsApi = {
  apply: (code: string) =>
    apiClient.post<{ discount: number }>('/api/coupons/apply', { code }),
  remove: () => apiClient.delete('/api/coupons/remove'),
}
