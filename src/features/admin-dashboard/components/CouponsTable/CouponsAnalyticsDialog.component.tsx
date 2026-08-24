"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {LABELS.couponAnalytics}
            {analyticsCoupon ? ` — ${analyticsCoupon.code}` : ""}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-[0.875rem] text-ink-muted">{LABELS.loading}</p>
        ) : analytics ? (
          <dl className="space-y-3 text-[0.875rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.redemptionCount}</dt>
              <dd className="tabular-nums font-medium">
                {analytics.usedCount}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.discountCostImpact}</dt>
              <dd className="tabular-nums font-medium">
                ₹{formatInrAmount(Number(analytics.totalDiscount))}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.revenueImpact}</dt>
              <dd className="tabular-nums font-medium">
                ₹{formatInrAmount(Number(analytics.revenueImpact ?? 0))}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.conversionRate}</dt>
              <dd className="tabular-nums font-medium">
                {analytics.conversionRate == null
                  ? "—"
                  : `${Math.round(Number(analytics.conversionRate) * 100)}%`}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.couponUsage}</dt>
              <dd className="tabular-nums font-medium">
                {analytics.usedCountCached}/
                {analytics.usageLimitTotal ?? LABELS.usageUnlimited}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-[0.875rem] text-ink-muted">
            {LABELS.couldNotLoadData}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
