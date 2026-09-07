import { apiClient } from "@/shared/api/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { UserStatus } from "@/shared/constants/statuses";
import type { Address, CurrentUser } from "@/shared/api/types";
import { assigneesApi } from "@/shared/api/assignees.api";

// Assignee lookup is shared infrastructure (consumed by shared/AssigneeSelect);
// re-exported here so existing admin-dashboard consumers keep their import paths.
export type {
  AssigneeCandidate,
  AssigneePermission,
} from "@/shared/api/assignees.api";

export const adminUsersApi = {
  list: async (
    params: PaginationQuery & {
      status?: string;
      roleId?: string;
      search?: string;
    } = {},
  ): Promise<PaginatedList<CurrentUser>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.status) q.set("status", params.status);
    if (params.roleId) q.set("roleId", params.roleId);
    if (params.search) q.set("search", params.search);
    const res = await apiClient.getWithResponse<CurrentUser[]>(
      API.users.list(q.toString()),
    );
    return unwrapPaginatedList(res);
  },
  listAssignees: assigneesApi.listAssignees,
  listRoles: () =>
    apiClient.get<{ id: string; name: string }[]>(API.users.roles),
  getById: (id: string) => apiClient.get<CurrentUser>(API.users.detail(id)),
  getAddresses: (id: string) =>
    apiClient.get<Address[]>(API.users.addresses(id)),
  updateStatus: (id: string, status: UserStatus) =>
    apiClient.patch<{ message: string }>(API.users.status(id), { status }),
  updateRole: (
    id: string,
    body: { roleId: string; vendorId?: string | null },
  ) => apiClient.patch<CurrentUser>(API.users.role(id), body),
  delete: (id: string) => apiClient.delete(API.users.detail(id)),
};
