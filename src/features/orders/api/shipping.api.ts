import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export const shippingApi = {
  tracking: (trackingNumber: string) =>
    apiClient.get<{ status: string; lastUpdate: string }>(API.shipping.tracking(trackingNumber)),
}
