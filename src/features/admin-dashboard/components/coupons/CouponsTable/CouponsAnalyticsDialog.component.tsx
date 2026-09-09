"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
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
  return (
    <Dialog
      open={Boolean(analyticsCoupon)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>
            {LABELS.couponAnalytics}
            {analyticsCoupon ? ` — ${analyticsCoupon.code}` : ""}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className={styles.dialogTextMuted}>{LABELS.loading}</p>
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
                ₹{formatInrAmount(Number(analytics.totalDiscount))}
              </dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.revenueImpact}</dt>
              <dd className={styles.analyticsDd}>
                ₹{formatInrAmount(Number(analytics.revenueImpact ?? 0))}
              </dd>
            </div>
            <div className={styles.analyticsRow}>
              <dt className={styles.analyticsDt}>{LABELS.conversionRate}</dt>
              <dd className={styles.analyticsDd}>
                {analytics.conversionRate == null
                  ? "—"
                  : `${Math.round(Number(analytics.conversionRate) * 100)}%`}
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
