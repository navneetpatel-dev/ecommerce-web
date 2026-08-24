"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { CouponAnalytics } from "@/shared/api/types";
import { formatPercent } from "../../utils/formatPercent";

interface CouponAnalyticsDialogProps {
  analyticsId: string | null;
  setAnalyticsId: (id: string | null) => void;
  analytics?: CouponAnalytics;
  analyticsLoading: boolean;
}

const CURRENCY_PREFIX = "₹";

/** Per-coupon redemption/analytics dialog (Rule 3 split). */
export function CouponAnalyticsDialog(props: CouponAnalyticsDialogProps) {
  const { analyticsId, setAnalyticsId, analytics, analyticsLoading } = props;

  const close = () => setAnalyticsId(null);

  const absorbedCopy = analytics
    ? formatLabel(LABELS.absorbedDiscountsSummary, {
        amount: formatInrAmount(Number(analytics.totalDiscount)),
      })
    : null;

  return (
    <Dialog
      open={Boolean(analyticsId)}
      onOpenChange={(next) => !next && close()}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{LABELS.couponAnalytics}</DialogTitle>
        </DialogHeader>
        {analyticsLoading ? (
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
              <dt className="text-ink-muted">{LABELS.absorbedDiscounts}</dt>
              <dd className="tabular-nums font-medium">
                {CURRENCY_PREFIX}
                {formatInrAmount(Number(analytics.totalDiscount))}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.revenueImpact}</dt>
              <dd className="tabular-nums font-medium">
                {CURRENCY_PREFIX}
                {formatInrAmount(Number(analytics.revenueImpact ?? 0))}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.conversionRate}</dt>
              <dd className="tabular-nums font-medium">
                {formatPercent(analytics.conversionRate)}
              </dd>
            </div>
            <p className="text-body-sm text-ink-muted">{absorbedCopy}</p>
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
