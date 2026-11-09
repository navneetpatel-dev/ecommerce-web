import { LABELS } from "@/shared/constants/labels";
import { MetricCard } from "../shared/MetricCard.component";
import { adminGiftCardsStyles as styles } from "../../styles/gift-cards/adminGiftCards.styles";

interface GiftCardLiabilityMetricsProps {
  metrics: {
    outstanding: string;
    outstandingCount: string;
    issued: string;
    redeemed: string;
    expired: string;
    cancelled: string;
  } | null;
}

/** What has been sold, and what customers can still redeem (the platform's liability). */
export function GiftCardLiabilityMetrics({
  metrics,
}: GiftCardLiabilityMetricsProps) {
  if (!metrics) return null;
  return (
    <div className={styles.metrics}>
      <MetricCard
        label={LABELS.giftCardOutstanding}
        value={metrics.outstanding}
        highlight
      />
      <MetricCard
        label={LABELS.giftCardOutstandingCount}
        value={metrics.outstandingCount}
      />
      <MetricCard label={LABELS.giftCardIssued} value={metrics.issued} />
      <MetricCard
        label={LABELS.giftCardRedeemedTotal}
        value={metrics.redeemed}
      />
      <MetricCard label={LABELS.giftCardExpiredTotal} value={metrics.expired} />
      <MetricCard
        label={LABELS.giftCardCancelledTotal}
        value={metrics.cancelled}
      />
    </div>
  );
}
