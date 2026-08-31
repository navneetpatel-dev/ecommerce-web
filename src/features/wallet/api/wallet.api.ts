import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { API } from "@/shared/constants/apiRoutes";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { API_TIMEOUT_MS } from "@/shared/constants/timing";
import {
  buildDatedExportFilenameFallback,
  resolveDownloadFilename,
} from "@/shared/utils/downloadFilename";
import {
  pollAsyncExportResponse,
  type ExportFileFormat,
} from "@/features/reports/hooks/useReportHubHelpers/index";
import type { AsyncExportResponse } from "@/features/reports/api/reportsEngine.api";
import type { PollExportResult } from "@/features/reports/utils/reportExportPollError";
import type { WalletTransaction } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { apiClient } from "@/shared/api/client";

async function exportStatement(
  from: string,
  to: string,
  format: ExportFileFormat,
  options?: { signal?: AbortSignal },
): Promise<PollExportResult | null> {
  const token = getApiSessionAdapter().getAccessToken();
  const params = new URLSearchParams({ from, to, format });
  const res = await fetch(
    `${CLIENT_API_BASE_URL}${API.wallet.statement(params.toString())}`,
    {
      credentials: "include",
      signal: options?.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
      headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
    },
  );
  if (!res.ok) {
    let message: string = LABELS.couldNotLoadReport;
    try {
      message = getApiErrorMessage(await res.json(), message);
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await res.json()) as { data?: Omit<AsyncExportResponse, "async"> };
    if (body.data?.exportId) {
      return pollAsyncExportResponse(
        { ...body.data, format: body.data.format ?? format },
        options,
      );
    }
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = resolveDownloadFilename(
    res,
    buildDatedExportFilenameFallback("wallet-statement", from, to, format),
  );
  a.click();
  URL.revokeObjectURL(url);
  return { outcome: "ready" };
}

export const walletApi = {
  getBalance: () => apiClient.get<{ balance: number }>(API.wallet.balance),
  getTransactions: (params?: { limit?: number; offset?: number }) => {
    const q = new URLSearchParams();
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.offset != null) q.set("offset", String(params.offset));
    const qs = q.toString();
    return apiClient.get<{ transactions: WalletTransaction[] }>(
      qs ? `${API.wallet.transactions}?${qs}` : API.wallet.transactions,
    );
  },
  exportStatement,
};
