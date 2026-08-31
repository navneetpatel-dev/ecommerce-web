import { apiClient } from "@/shared/api/client";
import { API } from "@/shared/constants/apiRoutes";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { API_TIMEOUT_MS } from "@/shared/constants/timing";
import { useAuthStore } from "@/shared/stores/auth.store";
import {
  buildDatedExportFilenameFallback,
  resolveDownloadFilename,
} from "@/shared/utils/downloadFilename";
import type { WalletTransaction } from "@/shared/api/types";

async function downloadStatement(
  from: string,
  to: string,
  format: "xlsx" | "csv" | "pdf",
) {
  const token = useAuthStore.getState().accessToken;
  const params = new URLSearchParams({ from, to, format });
  const res = await fetch(
    `${CLIENT_API_BASE_URL}${API.wallet.statement(params.toString())}`,
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
    buildDatedExportFilenameFallback("wallet-statement", from, to, format),
  );
  a.click();
  URL.revokeObjectURL(url);
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
  exportStatement: downloadStatement,
};
