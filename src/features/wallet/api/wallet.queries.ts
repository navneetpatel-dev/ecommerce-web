import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth.store";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { walletApi } from "./wallet.api";

export const walletKeys = {
  all: ["wallet"] as const,
  balance: () => [...walletKeys.all, "balance"] as const,
  transactions: () => [...walletKeys.all, "transactions"] as const,
};

export function useWalletBalance() {
  const currentUser = useAuthStore((s) => s.currentUser);
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: () => walletApi.getBalance(),
    enabled: Boolean(currentUser),
  });
}

interface TransactionsPage {
  transactions: Awaited<
    ReturnType<typeof walletApi.getTransactions>
  >["transactions"];
  nextOffset: number | null;
}

/**
 * Paged wallet history (§6: lists paginate from page one — never fetch all
 * rows). Offset-based infinite query; a full page means more may exist.
 */
export function useWalletTransactions(limit = DEFAULT_PAGE_LIMIT) {
  const currentUser = useAuthStore((s) => s.currentUser);

  return useInfiniteQuery({
    queryKey: [...walletKeys.transactions(), limit] as const,
    queryFn: async ({ pageParam }): Promise<TransactionsPage> => {
      const offset = (pageParam ?? 0) as number;
      const data = await walletApi.getTransactions({ limit, offset });
      const nextOffset =
        data.transactions.length === limit ? offset + limit : null;
      return { transactions: data.transactions, nextOffset };
    },
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    enabled: Boolean(currentUser),
    placeholderData: (prev) => prev,
  });
}
