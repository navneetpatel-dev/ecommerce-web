"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  formatInr,
  formatInrAmount,
} from "@/shared/utils/formatting/orderFormat";
import type { CouponAnalytics } from "@/shared/api/types";
import { formatPercent } from "../../../utils/coupons/formatPercent";
import { couponAnalyticsDialogStyles } from "../../../styles/coupons/vendorCouponsView.styles";

interface CouponAnalyticsDialogProps {
  analyticsId: string | null;
  setAnalyticsId: (id: string | null) => void;
  analytics?: CouponAnalytics;
  analyticsLoading: boolean;
}

/** Per-coupon redemption/analytics dialog (Rule 3 split). */
export function CouponAnalyticsDialog(props: CouponAnalyticsDialogProps) {
  const { analyticsId, setAnalyticsId, analytics, analyticsLoading } = props;

  const close = () => setAnalyticsId(null);
  const handleOpenChange = (next: boolean) => {
    if (!next) close();
  };

  const absorbedCopy = analytics
    ? formatLabel(LABELS.absorbedDiscountsSummary, {
        amount: formatInrAmount(analytics.totalDiscount),
      })
    : null;

  return (
    <Dialog open={Boolean(analyticsId)} onOpenChange={handleOpenChange}>
      <DialogContent
        className={couponAnalyticsDialogStyles.dialogContent}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{LABELS.couponAnalytics}</DialogTitle>
        </DialogHeader>
        {analyticsLoading ? (
          <dl
            className={couponAnalyticsDialogStyles.statsList}
            data-testid="vendor-coupon-analytics-skeleton"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={couponAnalyticsDialogStyles.statRow}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </dl>
        ) : analytics ? (
          <dl className={couponAnalyticsDialogStyles.statsList}>
            <div className={couponAnalyticsDialogStyles.statRow}>
              <dt className={couponAnalyticsDialogStyles.statLabel}>
                {LABELS.redemptionCount}
              </dt>
              <dd className={couponAnalyticsDialogStyles.statValue}>
                {analytics.usedCount}
              </dd>
            </div>
            <div className={couponAnalyticsDialogStyles.statRow}>
              <dt className={couponAnalyticsDialogStyles.statLabel}>
                {LABELS.absorbedDiscounts}
              </dt>
              <dd className={couponAnalyticsDialogStyles.statValue}>
                {formatInr(analytics.totalDiscount)}
              </dd>
            </div>
            <div className={couponAnalyticsDialogStyles.statRow}>
              <dt className={couponAnalyticsDialogStyles.statLabel}>
                {LABELS.revenueImpact}
              </dt>
              <dd className={couponAnalyticsDialogStyles.statValue}>
                {formatInr(analytics.revenueImpact)}
              </dd>
            </div>
            <div className={couponAnalyticsDialogStyles.statRow}>
              <dt className={couponAnalyticsDialogStyles.statLabel}>
                {LABELS.conversionRate}
              </dt>
              <dd className={couponAnalyticsDialogStyles.statValue}>
                {formatPercent(analytics.conversionRate)}
              </dd>
            </div>
            <p className={couponAnalyticsDialogStyles.absorbedText}>
              {absorbedCopy}
            </p>
          </dl>
        ) : (
          <p role="alert" className={couponAnalyticsDialogStyles.errorText}>
            {LABELS.couldNotLoadData}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
