import { apiClient } from '@/shared/api/client'

export const shippingApi = {
  tracking: (trackingNumber: string) =>
    apiClient.get<{ status: string; lastUpdate: string }>(`/api/shipping/tracking/${trackingNumber}`),
}
