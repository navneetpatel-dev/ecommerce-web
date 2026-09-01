"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { InfiniteLoadMore } from "@/shared/components/InfiniteLoadMore.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatPoints } from "@/shared/utils/formatPoints";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";
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
      className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8 lg:px-6"
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
      <div className="space-y-3 px-5 py-6 md:px-6">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full max-w-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-5 py-8 md:px-6">
        <EmptyState
          icon={Wallet}
          message={LABELS.errorRetryHint}
          actionLabel={onRetry ? LABELS.retry : undefined}
          onAction={onRetry}
          maxWidth="max-w-md"
          className="py-6 md:py-8"
        />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        message={LABELS.walletNoTransactions}
        maxWidth="max-w-md"
        className="py-10 md:py-12"
      />
    );
  }

  return (
    <>
      <ul className="divide-y divide-line">
        {transactions.map((row) => renderRow(row, onDownloadInvoice))}
      </ul>
      {hasNextPage ? (
        <div className="border-t border-line px-5 py-4 lg:px-6">
          <InfiniteLoadMore
            hasNextPage={hasNextPage}
            isFetchingNextPage={Boolean(isFetchingNextPage)}
            onLoadMore={onLoadMore ?? noop}
          />
        </div>
      ) : null}
    </>
  );
}

interface WalletBalanceCardProps {
  balance: number;
  purchasedBalance?: number;
  promotionalBalance?: number;
  isLoading?: boolean;
  className?: string;
}

export function WalletBalanceCard({
  balance,
  purchasedBalance,
  promotionalBalance,
  isLoading,
  className,
}: WalletBalanceCardProps) {
  return (
    <div
      className={cn(
        "relative border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
      />
      <TextEyebrow brand>{LABELS.walletBalance}</TextEyebrow>
      {isLoading ? (
        <Skeleton className="mt-3 h-10 w-40" />
      ) : (
        <p className="mt-2 font-display text-[2rem] leading-none tabular-nums text-brand md:text-[2.25rem]">
          {formatPoints(balance)}
        </p>
      )}
      <p className="mt-3 text-[0.875rem] text-ink-muted">
        {LABELS.walletPointsEqualsInr}
      </p>
      {!isLoading && (purchasedBalance != null || promotionalBalance != null) ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-line/80 bg-paper/40 px-3 py-2.5">
            <p className="text-[0.75rem] text-ink-faint">{LABELS.walletPurchasedBalance}</p>
            <p className="mt-0.5 text-body font-semibold tabular-nums text-ink">
              {formatPoints(purchasedBalance ?? 0)}
            </p>
          </div>
          <div className="rounded-md border border-line/80 bg-paper/40 px-3 py-2.5">
            <p className="text-[0.75rem] text-ink-faint">{LABELS.walletPromotionalBalance}</p>
            <p className="mt-0.5 text-body font-semibold tabular-nums text-ink">
              {formatPoints(promotionalBalance ?? 0)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
