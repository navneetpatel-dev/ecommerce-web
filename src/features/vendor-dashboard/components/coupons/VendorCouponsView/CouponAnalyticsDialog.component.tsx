"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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

  const absorbedCopy = analytics
    ? formatLabel(LABELS.absorbedDiscountsSummary, {
        amount: formatInrAmount(analytics.totalDiscount),
      })
    : null;

  return (
    <Dialog
      open={Boolean(analyticsId)}
      onOpenChange={(next) => !next && close()}
    >
      <DialogContent className={couponAnalyticsDialogStyles.dialogContent}>
        <DialogHeader>
          <DialogTitle>{LABELS.couponAnalytics}</DialogTitle>
        </DialogHeader>
        {analyticsLoading ? (
          <p className={couponAnalyticsDialogStyles.loadingText}>
            {LABELS.loading}
          </p>
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
          <p className={couponAnalyticsDialogStyles.errorText}>
            {LABELS.couldNotLoadData}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
