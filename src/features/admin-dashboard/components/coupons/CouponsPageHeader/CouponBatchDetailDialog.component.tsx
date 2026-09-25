"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import type { CouponBatch } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { couponsPageHeaderStyles } from "../../../styles/coupons/couponsPageHeader.styles";

interface CouponBatchDetailDialogProps {
  batchDetail: CouponBatch | null;
  onClose: () => void;
}

export function CouponBatchDetailDialog({
  batchDetail,
  onClose,
}: CouponBatchDetailDialogProps) {
  return (
    <Dialog
      open={Boolean(batchDetail)}
      onOpenChange={(next) => !next && onClose()}
    >
      <DialogContent className={couponsPageHeaderStyles.batchDialog}>
        <DialogHeader>
          <DialogTitle>{batchDetail?.name ?? LABELS.couponBatches}</DialogTitle>
        </DialogHeader>
        {batchDetail ? (
          <div className={couponsPageHeaderStyles.batchStack3}>
            <dl className={couponsPageHeaderStyles.batchDl}>
              <div className={couponsPageHeaderStyles.batchRow}>
                <dt className={couponsPageHeaderStyles.batchDt}>
                  {LABELS.batchGeneratedCount}
                </dt>
                <dd className={couponsPageHeaderStyles.batchDd}>
                  {batchDetail.generatedCount}
                </dd>
              </div>
              <div className={couponsPageHeaderStyles.batchRow}>
                <dt className={couponsPageHeaderStyles.batchDt}>
                  {LABELS.batchRedemptions}
                </dt>
                <dd className={couponsPageHeaderStyles.batchDd}>
                  {batchDetail.redemptionCount ?? 0}
                </dd>
              </div>
              <div className={couponsPageHeaderStyles.batchRow}>
                <dt className={couponsPageHeaderStyles.batchDt}>
                  {LABELS.batchDiscountImpact}
                </dt>
                <dd className={couponsPageHeaderStyles.batchDd}>
                  {formatInr(batchDetail.discountTotal)}
                </dd>
              </div>
              <div className={couponsPageHeaderStyles.batchRow}>
                <dt className={couponsPageHeaderStyles.batchDt}>
                  {LABELS.batchRevenueImpact}
                </dt>
                <dd className={couponsPageHeaderStyles.batchDd}>
                  {formatInr(batchDetail.revenueImpact)}
                </dd>
              </div>
            </dl>
            <ul className={couponsPageHeaderStyles.batchCodesList}>
              {(batchDetail.codes ?? []).map((code) => (
                <li
                  key={code}
                  className={couponsPageHeaderStyles.batchCodeItem}
                >
                  {code}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
