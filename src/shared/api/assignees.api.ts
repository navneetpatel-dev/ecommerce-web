import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  buildSearchParams,
  type PaginatedList,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";

export type AssigneeCandidate = {
  id: string;
  name: string;
  email: string;
};

export type AssigneePermission =
  typeof PERMISSIONS.TICKET_MANAGE | typeof PERMISSIONS.BUG_REPORT_MANAGE;

/** Staff eligible as assignees for a permission — used by ticket/bug features via shared AssigneeSelect. */
export const assigneesApi = {
  listAssignees: async (params: {
    permission: AssigneePermission;
    page?: number;
    limit?: number;
    search?: string;
    vendorId?: string;
  }): Promise<PaginatedList<AssigneeCandidate>> => {
    const res = await apiClient.getWithResponse<AssigneeCandidate[]>(
      API.users.assignees(
        buildSearchParams({
          permission: params.permission,
          page: params.page,
          limit: params.limit,
          search: params.search,
          vendorId: params.vendorId,
        }).toString(),
      ),
    );
    return unwrapPaginatedList(res);
  },
};
