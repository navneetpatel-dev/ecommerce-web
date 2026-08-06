import { apiClient } from '@/shared/api/client'
import type { Address, CurrentUser } from '@/shared/api/types'

export type UpdateProfileBody = {
  name?: string
  phone?: string | null
  emailMarketingConsent?: boolean
}

export type AddressInput = Omit<Address, 'id' | 'userId'>

export const usersApi = {
  getProfile: () => apiClient.get<CurrentUser>('/api/users/me'),
  updateProfile: (body: UpdateProfileBody) =>
    apiClient.patch<CurrentUser>('/api/users/me', body),
  deleteAccount: () => apiClient.delete<void>('/api/users/me'),
  exportAccount: () => apiClient.get<Record<string, unknown>>('/api/users/me/export'),
  uploadAvatar: (dataUrl: string) =>
    apiClient.post<CurrentUser>('/api/users/me/avatar', { dataUrl }),

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
