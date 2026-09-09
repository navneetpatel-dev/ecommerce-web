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

export function useWalletBalance() {
  const currentUser = useAuthStore((s) => s.currentUser);
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: () => walletApi.getBalance(),
    enabled: Boolean(currentUser),
  });
}

/**
 * Server-paginated wallet ledger (page/limit aligned with orders and admin lists).
 */
export function useWalletTransactions(page = 1, limit = DEFAULT_PAGE_LIMIT) {
  const currentUser = useAuthStore((s) => s.currentUser);

  return useQuery({
    queryKey: walletKeys.transactionsPage(page, limit),
    queryFn: () => walletApi.getTransactions({ page, limit }),
    enabled: Boolean(currentUser),
    placeholderData: (prev) => prev,
  });
}
