import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export const couponsApi = {
  apply: (code: string) =>
    apiClient.post<{ code: string; discount: number; type: string }>(API.coupons.apply, { code }),
  remove: () => apiClient.delete(API.coupons.remove),
}
