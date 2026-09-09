import { apiClient } from "@/shared/api/client/client";
import { downloadFile } from "@/shared/api/client/downloadFile";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { CommissionLedgerEntry, PayoutEntry } from "@/shared/api/types";

export type CommissionInvoiceEntry = {
  id: string;
  number: string;
  vendorId: string;
  payoutId: string | null;
  vendorName: string | null;
  taxableAmount: number;
  gstAmount: number;
  totalAmount: number;
  issuedAt: string;
};

export const commissionsApi = {
  list: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<CommissionLedgerEntry>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await apiClient.getWithResponse<CommissionLedgerEntry[]>(
      qs ? `${API.commissions.list}?${qs}` : API.commissions.list,
    );
    return unwrapPaginatedList(res);
  },
  vendorSummary: (vendorId: string) =>
    apiClient.get<{ total: number; pending: number; settled: number }>(
      API.commissions.vendor(vendorId),
    ),
  listInvoices: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<CommissionInvoiceEntry>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await apiClient.getWithResponse<CommissionInvoiceEntry[]>(
      qs ? `${API.commissions.invoices}?${qs}` : API.commissions.invoices,
    );
    return unwrapPaginatedList(res);
  },
  downloadInvoice: (invoiceId: string) =>
    downloadFile(
      API.commissions.invoicePdf(invoiceId),
      `commission-invoice_${invoiceId.slice(0, 8)}.pdf`,
    ),
};

export const payoutsApi = {
  list: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<PayoutEntry>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await apiClient.getWithResponse<PayoutEntry[]>(
      qs ? `${API.payouts.list}?${qs}` : API.payouts.list,
    );
    return unwrapPaginatedList(res);
  },
  process: () => apiClient.post<PayoutEntry[]>(API.payouts.process, {}),
  markPaid: (
    id: string,
    body: {
      paymentMethod: string;
      paymentReferenceNumber: string;
      paidAt?: string;
      proofOfPaymentUrl?: string;
      remarks?: string;
    },
  ) => apiClient.patch<PayoutEntry>(API.payouts.markPaid(id), body),
  markFailed: (id: string, reason: string) =>
    apiClient.patch<PayoutEntry>(API.payouts.markFailed(id), { reason }),
  retry: (id: string) =>
    apiClient.patch<PayoutEntry>(API.payouts.retry(id), {}),
};
