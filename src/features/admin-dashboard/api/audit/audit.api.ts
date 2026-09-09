import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";

export type AuditListQuery = PaginationQuery & {
  entityType?: string;
  actorId?: string;
  actor?: string;
  /** ISO date (YYYY-MM-DD) — inclusive start of the range on `createdAt`. */
  from?: string;
  /** ISO date (YYYY-MM-DD) — inclusive end of the range on `createdAt`. */
  to?: string;
};

export const auditApi = {
  list: async (
    params: AuditListQuery = {},
  ): Promise<PaginatedList<Record<string, unknown>>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.entityType) q.set("entityType", params.entityType);
    if (params.actorId) q.set("actorId", params.actorId);
    if (params.actor) q.set("actor", params.actor);
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);
    const qs = q.toString();
    const res = await apiClient.getWithResponse<Record<string, unknown>[]>(
      qs ? `${API.audit.list}?${qs}` : API.audit.list,
    );
    return unwrapPaginatedList(res);
  },
};
