import { useQuery, type QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { walletApi } from "./wallet.api";

export const walletKeys = {
  all: ["wallet"] as const,
  balance: () => [...walletKeys.all, "balance"] as const,
  transactions: () => [...walletKeys.all, "transactions"] as const,
  transactionsPage: (page: number, limit: number) =>
    [...walletKeys.transactions(), page, limit] as const,
  rechargePreview: (amountInr: number) =>
    [...walletKeys.all, "recharge-preview", amountInr] as const,
};

export function invalidateWalletQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: walletKeys.all });
}

/**
 * Both wallet queries gate on `accessToken`, never on `currentUser`. The auth
 * bootstrap hydrates `currentUser` from localStorage *before* its silent
 * `POST /api/auth/refresh` resolves, so a `currentUser` gate reads "signed in"
 * while the access token — memory-only (F-14) — is still null. The request then
 * leaves without a bearer and can only come back 401, which the client's
 * 401-recovery path answers with a refresh round-trip plus a retry: three
 * network rows for one badge. `useWalletBalance` is the header badge, so that
 * was every page load our signed-in customers made. The token is the honest
 * predicate — it exists only once a session is actually restorable — and
 * `useHeader`'s `actionsLoading` already holds the badge skeleton through the
 * window (`!authBootstrapped || …`), so nothing flickers.
 */
export function useWalletBalance() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: () => walletApi.getBalance(),
    enabled: Boolean(accessToken),
    // Money moved on another device (or in another tab) should be visible the
    // moment the customer comes back and looks at it.
    refetchOnWindowFocus: true,
  });
}

/**
 * Server-paginated wallet ledger (page/limit aligned with orders and admin lists).
 */
export function useWalletTransactions(page = 1, limit = DEFAULT_PAGE_LIMIT) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: walletKeys.transactionsPage(page, limit),
    queryFn: () => walletApi.getTransactions({ page, limit }),
    // Same token gate as `useWalletBalance` (see above). Its only mount surface
    // is the `/wallet` page, which is behind `AuthGate` and so already has the
    // token — this keeps one rule for every authed query in the app.
    enabled: Boolean(accessToken),
    placeholderData: (prev) => prev,
  });
}
