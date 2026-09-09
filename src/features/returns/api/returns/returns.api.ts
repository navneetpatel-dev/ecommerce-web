import { apiClient } from "@/shared/api/client/client";
import { downloadFile } from "@/shared/api/client/downloadFile";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { ReturnRequest } from "@/shared/api/types";

export type CreateReturnBody = {
  orderItemId: string;
  reasonCode: ReturnRequest["reasonCode"];
  reason: string;
  type?: "REFUND" | "EXCHANGE";
  photoUrls?: string[];
};

export const returnsApi = {
  list: () => apiClient.get<ReturnRequest[]>(API.returns.list),
  listAdmin: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ReturnRequest>> => {
    const res = await apiClient.getWithResponse<ReturnRequest[]>(
      withQuery(API.returns.admin, params),
    );
    return unwrapPaginatedList(res);
  },
  create: (body: CreateReturnBody) =>
    apiClient.post<ReturnRequest>(API.returns.create, body),
  get: (id: string) => apiClient.get<ReturnRequest>(API.returns.detail(id)),
  transition: (
    id: string,
    status: ReturnRequest["status"],
    rejectionReason?: string,
  ) =>
    apiClient.patch<{ message: string }>(API.returns.transition(id), {
      status,
      rejectionReason,
    }),
  delete: (id: string) => apiClient.delete(API.returns.delete(id)),
  downloadCreditNote: (id: string) =>
    downloadFile(
      API.returns.creditNote(id),
      `credit-note_${id.slice(0, 8)}.pdf`,
    ),
  downloadDebitNote: (id: string) =>
    downloadFile(API.returns.debitNote(id), `debit-note_${id.slice(0, 8)}.pdf`),
  retryRefund: (id: string) =>
    apiClient.post<ReturnRequest>(API.returns.retryRefund(id)),
  reschedulePickup: (id: string, slot: string) =>
    apiClient.post<ReturnRequest>(API.returns.reschedulePickup(id), { slot }),
};
