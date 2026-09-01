"use client";

import { Button } from "@/shared/components/ui/button";
import { InfiniteLoadMore } from "@/shared/components/InfiniteLoadMore.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatPoints } from "@/shared/utils/formatPoints";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { WalletTransaction } from "@/shared/api/types";

import { transactionSourceLabel } from "../utils/transactionSource";

interface WalletTransactionsListProps {
  transactions: WalletTransaction[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onDownloadInvoice?: (rechargeId: string) => void;
}

function creditAmountClass(isCredit: boolean) {
  return `text-body font-semibold tabular-nums ${
    isCredit ? "text-success" : "text-ink"
  }`;
}

function renderRow(
  row: WalletTransaction,
  onDownloadInvoice?: (rechargeId: string) => void,
) {
  const isCredit = row.type === "CREDIT";
  const signedAmount = `${isCredit ? "+" : "−"}${formatPoints(row.amount)}`;
  const rechargeId = row.rechargeId ?? (row.referenceType === "TOPUP" ? row.referenceId : null);
  return (
    <li
      key={row.id}
      className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
    >
      <div className="min-w-0">
        <p className="font-medium text-ink">{transactionSourceLabel(row)}</p>
        {row.description ? (
          <p className="mt-1 text-body-sm text-ink-muted">{row.description}</p>
        ) : null}
        <p className="mt-1 text-[0.75rem] text-ink-faint">
          {formatOrderDate(row.createdAt)}
        </p>
        {rechargeId && onDownloadInvoice ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => onDownloadInvoice(rechargeId)}
          >
            {LABELS.walletDownloadRechargeInvoice}
          </Button>
        ) : null}
      </div>
      <div className="text-right">
        <p className={creditAmountClass(isCredit)}>{signedAmount}</p>
        <p className="mt-0.5 text-[0.75rem] tabular-nums text-ink-muted">
          {formatLabel(LABELS.walletBalanceAfter, {
            amount: formatPoints(row.balanceAfter),
          })}
        </p>
      </div>
    </li>
  );
}

const noop = () => undefined;

export function WalletTransactionsList(props: WalletTransactionsListProps) {
  const {
    transactions,
    isLoading,
    isError,
    onRetry,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onDownloadInvoice,
  } = props;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-line bg-surface-raised px-5 py-10 text-center">
        <p className="text-body text-ink-muted">{LABELS.errorRetryHint}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-[0.875rem] font-medium text-brand underline-offset-4 hover:underline"
          >
            {LABELS.retry}
          </button>
        ) : null}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className="border border-line bg-surface-raised px-5 py-10 text-center text-body text-ink-muted">
        {LABELS.walletNoTransactions}
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-line border border-line bg-surface-raised">
        {transactions.map((row) => renderRow(row, onDownloadInvoice))}
      </ul>
      {hasNextPage ? (
        <InfiniteLoadMore
          hasNextPage={hasNextPage}
          isFetchingNextPage={Boolean(isFetchingNextPage)}
          onLoadMore={onLoadMore ?? noop}
        />
      ) : null}
    </>
  );
}

interface WalletBalanceCardProps {
  balance: number;
  purchasedBalance?: number;
  promotionalBalance?: number;
  isLoading?: boolean;
}

export function WalletBalanceCard({
  balance,
  purchasedBalance,
  promotionalBalance,
  isLoading,
}: WalletBalanceCardProps) {
  return (
    <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
      />
      <TextEyebrow brand>{LABELS.wallet}</TextEyebrow>
      {isLoading ? (
        <Skeleton className="mt-3 h-10 w-40" />
      ) : (
        <p className="mt-2 font-display text-[2rem] leading-none tabular-nums text-brand">
          {formatPoints(balance)}
        </p>
      )}
      <p className="mt-3 text-[0.875rem] text-ink-muted">
        {LABELS.walletPageDescription}
      </p>
      {!isLoading && (purchasedBalance != null || promotionalBalance != null) ? (
        <p className="mt-2 text-[0.75rem] tabular-nums text-ink-faint">
          {LABELS.walletPurchasedBalance} {formatPoints(purchasedBalance ?? 0)}
          {" · "}
          {LABELS.walletPromotionalBalance} {formatPoints(promotionalBalance ?? 0)}
        </p>
      ) : null}
    </div>
  );
}
