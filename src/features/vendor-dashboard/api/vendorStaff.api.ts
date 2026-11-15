import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  status: string;
  roleName: string;
  isOwner: boolean;
  createdAt: string;
}

export interface AddStaffPayload {
  email: string;
  name: string;
}

export const vendorStaffApi = {
  list: () => apiClient.get<StaffMember[]>(API.vendors.meStaff),
  add: (data: AddStaffPayload) =>
    apiClient.post<StaffMember>(API.vendors.meStaff, data),
  remove: (userId: string) =>
    apiClient.delete<{ success: boolean }>(API.vendors.removeStaff(userId)),
};
