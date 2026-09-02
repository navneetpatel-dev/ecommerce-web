"use client";

import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatPoints";
import { cn } from "@/shared/utils/cn";
import { WalletBalanceCardSkeleton } from "./WalletSectionSkeletons.component";

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
  if (isLoading) {
    return <WalletBalanceCardSkeleton className={className} />;
  }

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
      <p className="mt-2 font-display text-[2rem] leading-none tabular-nums text-brand md:text-[2.25rem]">
        {formatPoints(balance)}
      </p>
      <p className="mt-3 text-[0.875rem] text-ink-muted">
        {LABELS.walletPointsEqualsInr}
      </p>
      {purchasedBalance != null || promotionalBalance != null ? (
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
