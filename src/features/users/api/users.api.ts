import { apiClient } from '@/shared/api/client'
import type { Address, CurrentUser } from '@/shared/api/types'

export type NotificationPrefs = {
  orderUpdates: boolean
  smsAlerts: boolean
  shippingNotifications: boolean
}

export type UpdateProfileBody = {
  name?: string
  phone?: string | null
  email?: string
  emailMarketingConsent?: boolean
  notificationPrefs?: Partial<NotificationPrefs>
}

export type AddressInput = Omit<Address, 'id' | 'userId'>

export type UpdateProfileResult = CurrentUser & {
  emailVerificationToken?: string
}

export const usersApi = {
  getProfile: () => apiClient.get<CurrentUser>('/api/users/me'),
  updateProfile: (body: UpdateProfileBody) =>
    apiClient.patch<UpdateProfileResult>('/api/users/me', body),
  deleteAccount: () => apiClient.delete<void>('/api/users/me'),
  exportAccount: () => apiClient.get<Record<string, unknown>>('/api/users/me/export'),
  uploadAvatar: (dataUrl: string) =>
    apiClient.post<CurrentUser>('/api/users/me/avatar', { dataUrl }),
  confirmEmail: (token: string) =>
    apiClient.post<CurrentUser>('/api/users/me/confirm-email', { token }),

  getAddresses: () => apiClient.get<Address[]>('/api/users/addresses'),
  createAddress: (body: AddressInput) =>
    apiClient.post<Address>('/api/users/addresses', body),
  updateAddress: (addressId: string, body: Partial<AddressInput>) =>
    apiClient.patch<Address>(`/api/users/addresses/${addressId}`, body),
  deleteAddress: (addressId: string) =>
    apiClient.delete<void>(`/api/users/addresses/${addressId}`),
  setDefaultAddress: (addressId: string) =>
    apiClient.post<Address>(`/api/users/addresses/${addressId}/default`),
}
