import { apiClient } from "@/shared/api/client/client";
import { downloadFile } from "@/shared/api/client/downloadFile";
import {
  unwrapPaginatedList,
  withQuery,
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
    const res = await apiClient.getWithResponse<CommissionLedgerEntry[]>(
      withQuery(API.commissions.list, params),
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
    const res = await apiClient.getWithResponse<CommissionInvoiceEntry[]>(
      withQuery(API.commissions.invoices, params),
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
    const res = await apiClient.getWithResponse<PayoutEntry[]>(
      withQuery(API.payouts.list, params),
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
