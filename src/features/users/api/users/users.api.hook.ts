import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import type { Address, CurrentUser } from "@/shared/api/types";

// AddressInput is shared infrastructure (consumed by shared/AddressFormDialog);
// re-exported here so existing users-feature consumers keep their import path.
export type { AddressInput } from "@/shared/api/types";
import type { AddressInput } from "@/shared/api/types";

export type UpdateProfileBody = {
  name?: string;
  phone?: string | null;
  emailMarketingConsent?: boolean;
  avatarUrl?: string | null;
};

export const usersApi = {
  getProfile: () => apiClient.get<CurrentUser>(API.usersMe.profile),
  updateProfile: (body: UpdateProfileBody) =>
    apiClient.patch<CurrentUser>(API.usersMe.profile, body),
  deleteAccount: () => apiClient.delete<void>(API.usersMe.profile),
  exportAccount: () =>
    apiClient.get<Record<string, unknown>>(API.usersMe.export),

  getAddresses: () => apiClient.get<Address[]>(API.usersMe.addresses),
  createAddress: (body: AddressInput) =>
    apiClient.post<Address>(API.usersMe.addresses, body),
  updateAddress: (addressId: string, body: Partial<AddressInput>) =>
    apiClient.patch<Address>(API.usersMe.address(addressId), body),
  deleteAddress: (addressId: string) =>
    apiClient.delete<void>(API.usersMe.address(addressId)),
  setDefaultAddress: (addressId: string) =>
    apiClient.post<Address>(API.usersMe.addressDefault(addressId)),
};
