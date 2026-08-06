import { apiClient } from '@/shared/api/client'

export const adminShippingApi = {
  zones: () => apiClient.get<unknown[]>('/api/shipping/zones'),
  createZone: (body: { name: string; states?: string[]; pincodePrefixes?: string[] }) =>
    apiClient.post<unknown>('/api/shipping/zones', body),
  deleteZone: (id: string) => apiClient.delete(`/api/shipping/zones/${id}`),
  rates: () => apiClient.get<unknown[]>('/api/shipping/rates/admin'),
  createRate: (body: unknown) => apiClient.post<unknown>('/api/shipping/rates', body),
}
