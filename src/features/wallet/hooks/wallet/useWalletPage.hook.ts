"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  useWalletBalance,
  useWalletTransactions,
} from "../../api/wallet/wallet.queries";
import { walletApi } from "../../api/wallet/wallet.api";

export function useWalletPage() {
  const [page, setPage] = useState(1);
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const balanceQuery = useWalletBalance();
  const transactionsQuery = useWalletTransactions(page, DEFAULT_PAGE_LIMIT);
  const walletSectionLoading = !authBootstrapped || balanceQuery.isLoading;

  const transactions = transactionsQuery.data?.items ?? [];
  const total = transactionsQuery.data?.total ?? 0;
  const totalPages = transactionsQuery.data?.totalPages ?? 1;
  const from =
    total === 0 || transactions.length === 0
      ? 0
      : (page - 1) * DEFAULT_PAGE_LIMIT + 1;
  const to =
    transactions.length === 0
      ? 0
      : Math.min((page - 1) * DEFAULT_PAGE_LIMIT + transactions.length, total);

  const balancePoints =
    balanceQuery.data?.points ?? balanceQuery.data?.balance ?? 0;
  const transactionsError = transactionsQuery.isError
    ? LABELS.errorRetryHint
    : null;

  return {
    page,
    setPage,
    walletSectionLoading,
    balance: balanceQuery.data,
    balancePoints,
    purchasedBalance: balanceQuery.data?.purchasedBalance,
    promotionalBalance: balanceQuery.data?.promotionalBalance,
    transactions,
    total,
    totalPages,
    from,
    to,
    transactionsLoading: transactionsQuery.isLoading,
    transactionsError,
    retryTransactions: () => void transactionsQuery.refetch(),
    downloadInvoice: (id: string) => {
      walletApi
        .downloadRechargeInvoice(id)
        .catch((error: unknown) =>
          notifyError(getApiErrorMessage(error, LABELS.downloadFailed)),
        );
    },
  };
}
