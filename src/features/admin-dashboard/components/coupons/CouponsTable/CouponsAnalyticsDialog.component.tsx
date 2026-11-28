"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { couponsTableStyles as styles } from "../../../styles/coupons/couponsTable.styles";

interface CouponsAnalyticsDialogProps {
  analyticsCoupon: Coupon | null;
  analytics: CouponAnalytics | undefined;
  loading: boolean;
  onClose: () => void;
}

export function CouponsAnalyticsDialog({
  analyticsCoupon,
  analytics,
  loading,
  onClose,
}: CouponsAnalyticsDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={Boolean(analyticsCoupon)} onOpenChange={handleOpenChange}>
      <DialogContent
        className={styles.dialogContent}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            {LABELS.couponAnalytics}
            {analyticsCoupon ? ` — ${analyticsCoupon.code}` : ""}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <dl
            className={styles.analyticsList}
            data-testid="coupons-analytics-skeleton"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.analyticsRow}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </dl>
        ) : analytics ? (
          <dl className={styles.analyticsList}>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.redemptionCount}</dt>
              <dd className={styles.analyticsDd}>{analytics.usedCount}</dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>
                {LABELS.discountCostImpact}
              </dt>
              <dd className={styles.analyticsDd}>
                {formatInr(analytics.fundingCost)}
              </dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.customerSavings}</dt>
              <dd className={styles.analyticsDd}>
                {formatInr(analytics.customerSavings)}
              </dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.cashbackCredited}</dt>
              <dd className={styles.analyticsDd}>
                {formatInr(analytics.cashbackTotal)}
              </dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.revenueImpact}</dt>
              <dd className={styles.analyticsDd}>
                {formatInr(analytics.revenueImpact)}
              </dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.conversionRate}</dt>
              <dd className={styles.analyticsDd}>
                {analytics.limitUsedPercent == null
                  ? "—"
                  : `${analytics.limitUsedPercent}%`}
              </dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.couponUsage}</dt>
              <dd className={styles.analyticsDd}>
                {analytics.usedCountCached}/
                {analytics.usageLimitTotal ?? LABELS.usageUnlimited}
              </dd>
            </div>
          </dl>
        ) : (
          <p className={styles.dialogTextMuted}>{LABELS.couldNotLoadData}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
