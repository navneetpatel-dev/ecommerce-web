import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export const adminShippingApi = {
  zones: () => apiClient.get<unknown[]>(API.shipping.zones),
  createZone: (body: { name: string; states?: string[]; pincodePrefixes?: string[] }) =>
    apiClient.post<unknown>(API.shipping.zones, body),
  deleteZone: (id: string) => apiClient.delete(API.shipping.zone(id)),
  rates: () => apiClient.get<unknown[]>(API.shipping.adminRates),
  createRate: (body: unknown) => apiClient.post<unknown>(API.shipping.createRate, body),
}
