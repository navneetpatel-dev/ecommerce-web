import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
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
    const q = new URLSearchParams();
    q.set("permission", params.permission);
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.vendorId) q.set("vendorId", params.vendorId);
    const res = await apiClient.getWithResponse<AssigneeCandidate[]>(
      API.users.assignees(q.toString()),
    );
    return unwrapPaginatedList(res);
  },
};
