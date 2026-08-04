import { apiClient } from '@/shared/api/client'
import type { Address, CurrentUser } from '@/shared/api/types'

export const usersApi = {
  getProfile: () => apiClient.get<CurrentUser>('/api/users/profile'),
  updateProfile: (body: { name?: string; phone?: string }) =>
    apiClient.patch<CurrentUser>('/api/users/profile', body),
  getAddresses: () => apiClient.get<Address[]>('/api/users/addresses'),
  createAddress: (body: Omit<Address, 'id' | 'userId'>) =>
    apiClient.post<Address>('/api/users/addresses', body),
}
