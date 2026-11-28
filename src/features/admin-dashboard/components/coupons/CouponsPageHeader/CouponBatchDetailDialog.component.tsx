"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useCouponBatchActions } from "../../../hooks/coupons/useCouponBatchActions.hook";
import { couponDialogStyles } from "../../../styles/coupons/couponDialogs.styles";
import type { CouponBatch } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { couponsPageHeaderStyles } from "../../../styles/coupons/couponsPageHeader.styles";

interface CouponBatchDetailDialogProps {
  batchDetail: CouponBatch | null;
  onClose: () => void;
  onShowBatch?: (batch: { id: string; name: string } | null) => void;
}

export function CouponBatchDetailDialog({
  batchDetail,
  onClose,
  onShowBatch,
}: CouponBatchDetailDialogProps) {
  const actions = useCouponBatchActions(batchDetail);
  const showInList = () => {
    if (batchDetail)
      onShowBatch?.({ id: batchDetail.id, name: batchDetail.name });
    onClose();
  };
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  return (
    <Dialog open={Boolean(batchDetail)} onOpenChange={handleOpenChange}>
      <DialogContent
        className={couponsPageHeaderStyles.batchDialog}
        aria-describedby={undefined}
      >
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
            {actions.statusMessage ? (
              <p
                role="status"
                className={couponDialogStyles.batchStatusMessage}
              >
                {actions.statusMessage}
              </p>
            ) : null}
            {actions.statusError ? (
              <p role="alert" className={couponDialogStyles.batchStatusError}>
                {actions.statusError}
              </p>
            ) : null}
            <div className={couponDialogStyles.actions}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={actions.exportCodes}
              >
                {LABELS.exportBatchCodes}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={actions.pause}
                disabled={actions.isPending}
              >
                {LABELS.pauseBatch}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={actions.resume}
                disabled={actions.isPending}
              >
                {LABELS.resumeBatch}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={showInList}
              >
                {LABELS.showBatchInList}
              </Button>
            </div>
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
