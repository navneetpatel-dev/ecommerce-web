import { usersApi, type AddressInput, type UpdateProfileBody } from '@/features/users/api/users.api'
import { authApi } from '@/features/auth/api/auth.api'
import type { AccountProfile } from '../types'

export const accountApi = {
  getProfile: () => usersApi.getProfile() as Promise<AccountProfile>,
  updateProfile: (body: UpdateProfileBody) => usersApi.updateProfile(body),
  deleteAccount: () => usersApi.deleteAccount(),
  exportAccount: () => usersApi.exportAccount(),

  getAddresses: () => usersApi.getAddresses(),
  createAddress: (body: AddressInput) => usersApi.createAddress(body),
  updateAddress: (addressId: string, body: Partial<AddressInput>) =>
    usersApi.updateAddress(addressId, body),
  deleteAddress: (addressId: string) => usersApi.deleteAddress(addressId),
  setDefaultAddress: (addressId: string) => usersApi.setDefaultAddress(addressId),

  listSessions: () => authApi.listSessions(),
  revokeSession: (family: string) => authApi.revokeSession(family),
  revokeOtherSessions: () => authApi.revokeOtherSessions(),
}
