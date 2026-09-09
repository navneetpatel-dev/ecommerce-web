"use client";

import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { cn } from "@/shared/utils/dom/cn";
import { WalletBalanceCardSkeleton } from "./WalletSectionSkeletons.component";
import { walletPageContentStyles as styles } from "./walletPageContent.styles";

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
    <div className={cn(styles.cardContainer, className)}>
      <div aria-hidden className={styles.accentStripe} />
      <TextEyebrow brand>{LABELS.walletBalance}</TextEyebrow>
      <p className={styles.balanceAmount}>{formatPoints(balance)}</p>
      <p className={styles.balanceSubtext}>{LABELS.walletPointsEqualsInr}</p>
      {purchasedBalance != null || promotionalBalance != null ? (
        <div className={styles.breakdownGrid}>
          <div className={styles.breakdownCard}>
            <p className={styles.breakdownLabel}>
              {LABELS.walletPurchasedBalance}
            </p>
            <p className={styles.breakdownValue}>
              {formatPoints(purchasedBalance ?? 0)}
            </p>
          </div>
          <div className={styles.breakdownCard}>
            <p className={styles.breakdownLabel}>
              {LABELS.walletPromotionalBalance}
            </p>
            <p className={styles.breakdownValue}>
              {formatPoints(promotionalBalance ?? 0)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
