import { apiClient } from '@/shared/api/client'

export const couponsApi = {
  apply: (code: string) =>
    apiClient.post<{ code: string; discount: number; type: string }>('/api/coupons/apply', { code }),
  remove: () => apiClient.delete('/api/coupons/remove'),
}
