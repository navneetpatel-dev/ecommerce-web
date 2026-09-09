import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  buildSearchParams,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
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
    const res = await apiClient.getWithResponse<CurrentUser[]>(
      API.users.list(
        buildSearchParams({
          page: params.page,
          limit: params.limit,
          status: params.status,
          roleId: params.roleId,
          search: params.search,
        }).toString(),
      ),
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
