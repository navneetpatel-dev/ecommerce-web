import { apiClient } from "@/shared/api/client/client";
import { downloadFile } from "@/shared/api/client/downloadFile";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import type { ReturnRequest } from "@/shared/api/types";

export type CreateReturnBody = {
  orderItemId: string;
  /** Units of the line to return (the whole line when absent). */
  returnQuantity?: number;
  reasonCode: ReturnRequest["reasonCode"];
  reason: string;
  type?: "REFUND" | "EXCHANGE";
  photoUrls?: string[];
};

/** What a return would refund, before it's asked for (rupees, from the server). */
export type ReturnEstimate = {
  refund: number;
  offerAdjustment: number;
  offerNames: string[];
  cashbackClawback: number;
  returnShippingFee: number;
};

export const returnsApi = {
  estimate: (params: {
    orderItemId: string;
    returnQuantity?: number;
    reasonCode?: string;
  }) =>
    apiClient.get<ReturnEstimate>(
      API.returns.estimate(
        new URLSearchParams(
          Object.entries(params).flatMap(([key, value]) =>
            value == null ? [] : [[key, String(value)]],
          ),
        ).toString(),
      ),
    ),
  list: () => apiClient.get<ReturnRequest[]>(API.returns.list),
  listAdmin: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ReturnRequest>> => {
    const res = await apiClient.getWithResponse<ReturnRequest[]>(
      withQuery(API.returns.admin, params),
    );
    return unwrapPaginatedList(res);
  },
  vendorList: async (page = 1, limit = DEFAULT_PAGE_LIMIT) => {
    const res = await apiClient.getWithResponse<ReturnRequest[]>(
      API.returns.vendorList(`?page=${page}&limit=${limit}`),
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
  /** Puts a picked-up return's units back into sellable stock (once; never automatic). */
  restock: (id: string) =>
    apiClient.post<ReturnRequest>(API.returns.restock(id)),
  reschedulePickup: (id: string, slot: string) =>
    apiClient.post<ReturnRequest>(API.returns.reschedulePickup(id), { slot }),
};
