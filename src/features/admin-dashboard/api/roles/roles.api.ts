import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export interface AdminRole {
  id: string;
  name: string;
  isSystemRole: boolean;
  permissionKeys: string[];
  createdAt: string;
}

export interface AdminPermission {
  id: string;
  key: string;
}

export const rolesApi = {
  list: () => apiClient.get<AdminRole[]>(API.roles.list),
  listPermissions: () =>
    apiClient.get<AdminPermission[]>(API.roles.permissions),
  create: (name: string) => apiClient.post<AdminRole>(API.roles.list, { name }),
  rename: (id: string, name: string) =>
    apiClient.patch<AdminRole>(API.roles.detail(id), { name }),
  delete: (id: string) => apiClient.delete(API.roles.detail(id)),
  setPermissions: (id: string, permissionKeys: string[]) =>
    apiClient.patch<AdminRole>(API.roles.setPermissions(id), {
      permissionKeys,
    }),
};
