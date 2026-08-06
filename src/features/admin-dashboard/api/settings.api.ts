import { apiClient } from '@/shared/api/client'

export type PublicPlatformSettings = {
  freeShippingThreshold: number
  defaultReturnWindow: number
  supportEmail: string
  supportHours: string
}

export type AdminPlatformSettings = PublicPlatformSettings & {
  defaultCommissionRate: number
  autoApproveProducts: boolean
  payoutCycle: string
}

export const settingsApi = {
  getPublic: () => apiClient.get<PublicPlatformSettings>('/api/settings/public'),
  get: () => apiClient.get<AdminPlatformSettings>('/api/settings'),
  update: (body: AdminPlatformSettings) => apiClient.put<AdminPlatformSettings>('/api/settings', body),
}
