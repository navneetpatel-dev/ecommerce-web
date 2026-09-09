import { apiClient } from "@/shared/api/client/client";
import { downloadFile } from "@/shared/api/client/downloadFile";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { buildReportExportFilenameFallback } from "@/shared/utils/files/downloadFilename";
import type { WalletTransaction } from "@/shared/api/types";

export type WalletBalanceResponse = {
  balance: number;
  points: number;
  unit: "POINT";
  redemptionRate: number;
  rechargeEnabled: boolean;
  purchasedBalance?: number;
  promotionalBalance?: number;
  limits: {
    minInr: number;
    maxInr: number;
    maxBalance: number;
    presetsInr: number[];
    pointsPerRupee: number;
  };
};

export type WalletRechargeCheckout = {
  rechargeId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  pointsToCredit: number;
  checkoutConfigId?: string;
};

export type WalletRechargePreviewResponse = {
  amountInr: number;
  pointsToCredit: number;
  validationCode: "ok" | "below-min" | "above-max" | "max-balance" | "disabled";
};

export type WalletStatementExportFilters = {
  from: string;
  to: string;
};

function buildStatementQuery(
  filters: WalletStatementExportFilters & { format: "xlsx" | "csv" | "pdf" },
) {
  const params = new URLSearchParams();
  params.set("from", filters.from);
  params.set("to", filters.to);
  params.set("format", filters.format);
  return params.toString();
}

export const walletApi = {
  getBalance: () => apiClient.get<WalletBalanceResponse>(API.wallet.balance),
  previewRecharge: (amountInr: number) =>
    apiClient.get<WalletRechargePreviewResponse>(
      API.wallet.rechargePreview(amountInr),
    ),
  getTransactions: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<WalletTransaction>> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? DEFAULT_PAGE_LIMIT;
    const res = await apiClient.getWithResponse<WalletTransaction[]>(
      `${API.wallet.transactions}?page=${page}&limit=${limit}`,
    );
    return unwrapPaginatedList(res);
  },
  createRecharge: (amountInr: number, idempotencyKey?: string) =>
    apiClient.post<WalletRechargeCheckout>(API.wallet.recharge, {
      amountInr,
      ...(idempotencyKey ? { idempotencyKey } : {}),
    }),
  verifyRecharge: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    rechargeId?: string;
  }) => apiClient.post(API.wallet.rechargeVerify, payload),
  getRechargeStatus: (id: string) =>
    apiClient.get<{
      id: string;
      status: string;
      amountInr: number;
      pointsCredited: number;
      paidAt: string | null;
    }>(API.wallet.rechargeStatus(id)),
  downloadRechargeInvoice: (id: string) =>
    downloadFile(
      API.wallet.rechargeInvoice(id),
      `wallet-recharge_${id.slice(0, 8)}.pdf`,
    ),
  exportStatement: (
    filters: WalletStatementExportFilters,
    format: "xlsx" | "csv" | "pdf" = "xlsx",
  ) =>
    downloadFile(
      API.wallet.statement(buildStatementQuery({ ...filters, format })),
      buildReportExportFilenameFallback(
        "customer-wallet-statement",
        filters.from,
        filters.to,
        format,
      ),
    ),
};
