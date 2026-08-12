import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export type PublicPlatformSettings = {
  freeShippingThreshold: number
  defaultReturnWindow: number
  supportEmail: string
  supportHours: string
  ticketReopenWindowDays: number
  bugVerifyWindowDays: number
  bugCloseWindowDays: number
}

export type AdminPlatformSettings = PublicPlatformSettings & {
  defaultCommissionRate: number
  tcsRatePercent: number
  tdsRatePercent: number
  autoApproveProducts: boolean
  payoutCycle: string
  returnShippingFee: number
}

export const settingsApi = {
  getPublic: () => apiClient.get<PublicPlatformSettings>(API.settings.public),
  get: () => apiClient.get<AdminPlatformSettings>(API.settings.root),
  update: (body: AdminPlatformSettings) => apiClient.put<AdminPlatformSettings>(API.settings.root, body),
}
