"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import type { CouponBatch } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{batchDetail?.name ?? LABELS.couponBatches}</DialogTitle>
        </DialogHeader>
        {batchDetail ? (
          <div className="space-y-3">
            <dl className="space-y-2 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.batchGeneratedCount}</dt>
                <dd className="tabular-nums font-medium">
                  {batchDetail.generatedCount}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.batchRedemptions}</dt>
                <dd className="tabular-nums font-medium">
                  {batchDetail.redemptionCount ?? 0}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.batchDiscountImpact}</dt>
                <dd className="tabular-nums font-medium">
                  ₹{formatInrAmount(Number(batchDetail.discountTotal ?? 0))}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.batchRevenueImpact}</dt>
                <dd className="tabular-nums font-medium">
                  ₹{formatInrAmount(Number(batchDetail.revenueImpact ?? 0))}
                </dd>
              </div>
            </dl>
            <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-line p-2 font-mono text-[0.8125rem]">
              {(batchDetail.codes ?? []).map((code) => (
                <li key={code} className="px-1 py-0.5 text-ink">
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
