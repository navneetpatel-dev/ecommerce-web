import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { apiClient } from "@/shared/api/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/pagination";
import { API } from "@/shared/constants/apiRoutes";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { API_TIMEOUT_MS, EXPORT_DOWNLOAD_TIMEOUT_MS } from "@/shared/constants/timing";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import {
  buildReportExportFilenameFallback,
  resolveDownloadFilename,
} from "@/shared/utils/downloadFilename";
import { apiErrorFromFailureBody } from "@/shared/utils/apiErrorMessage";
import { ApiError } from "@/shared/types/apiError.types";
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

async function downloadStatementFile(path: string, fallbackName: string) {
  const token = getApiSessionAdapter().getAccessToken();
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.timeout(EXPORT_DOWNLOAD_TIMEOUT_MS),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON error body */
    }
    const err = apiErrorFromFailureBody(body, res.status);
    (err as ApiError & { status?: number }).status = res.status;
    throw err;
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = resolveDownloadFilename(res, fallbackName);
  a.click();
  URL.revokeObjectURL(url);
}

export const walletApi = {
  getBalance: () => apiClient.get<WalletBalanceResponse>(API.wallet.balance),
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
  downloadRechargeInvoice: async (id: string) => {
    const token = getApiSessionAdapter().getAccessToken();
    const res = await fetch(
      `${CLIENT_API_BASE_URL}${API.wallet.rechargeInvoice(id)}`,
      {
        credentials: "include",
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
        headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
      },
    );
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = resolveDownloadFilename(
      res,
      `wallet-recharge_${id.slice(0, 8)}.pdf`,
    );
    a.click();
    URL.revokeObjectURL(url);
  },
  exportStatement: (
    filters: WalletStatementExportFilters,
    format: "xlsx" | "csv" | "pdf" = "xlsx",
  ) =>
    downloadStatementFile(
      API.wallet.statement(buildStatementQuery({ ...filters, format })),
      buildReportExportFilenameFallback(
        "customer-wallet-statement",
        filters.from,
        filters.to,
        format,
      ),
    ),
};
