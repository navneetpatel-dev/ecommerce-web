"use client";

import { BarChart2, Eye, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import {
  COUPON_STATUS,
  type CouponStatusValue,
} from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Coupon } from "@/shared/api/types";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import type { useCouponRowActions } from "../../../hooks/coupons/useCouponRowActions.hook";

interface CouponRowActionsProps {
  row: Coupon;
  readOnly: boolean;
  allowReject: boolean;
  rowActions: ReturnType<typeof useCouponRowActions>;
}

export function CouponRowActions({
  row,
  readOnly,
  allowReject,
  rowActions,
}: CouponRowActionsProps) {
  // Returned, so a failure shows in the confirm dialog rather than vanishing.
  const setStatus = (status: CouponStatusValue) => (note?: string) =>
    rowActions.changeStatus({ id: row.id, status, note });
  const openAnalytics = () => rowActions.setAnalyticsCouponId(row.id);
  const openDetail = () => rowActions.setDetailCoupon(row);
  const openEdit = () => rowActions.setEditCoupon(row);
  const canEdit = row.status !== COUPON_STATUS.ARCHIVED;

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        onClick={openAnalytics}
      >
        <BarChart2 strokeWidth={2.25} aria-hidden />
        <span>{LABELS.viewAnalytics}</span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        onClick={openDetail}
      >
        <Eye strokeWidth={2.25} aria-hidden />
        <span>{LABELS.viewCoupon}</span>
      </Button>
      {!readOnly && canEdit ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
          onClick={openEdit}
        >
          <Pencil strokeWidth={2.25} aria-hidden />
          <span>{LABELS.editCoupon}</span>
        </Button>
      ) : null}
      {allowReject && row.status === COUPON_STATUS.PENDING_APPROVAL ? (
        <AdminConfirmAction
          label={LABELS.approveCoupon}
          tone="success"
          dialogVariant="success"
          title={LABELS.confirmApproveCouponTitle}
          description={formatLabel(LABELS.confirmApproveCouponBody, {
            code: row.code,
          })}
          onConfirm={setStatus(COUPON_STATUS.ACTIVE)}
        />
      ) : null}
      {!readOnly && row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          tone="neutral"
          dialogVariant="warning"
          title={LABELS.confirmPauseCouponTitle}
          description={formatLabel(LABELS.confirmPauseCouponBody, {
            code: row.code,
          })}
          onConfirm={setStatus(COUPON_STATUS.PAUSED)}
        />
      ) : null}
      {!readOnly &&
      (row.status === COUPON_STATUS.PAUSED ||
        row.status === COUPON_STATUS.DRAFT) ? (
        <AdminConfirmAction
          label={LABELS.activateCoupon}
          tone="success"
          dialogVariant="success"
          title={LABELS.confirmActivateCouponTitle}
          description={formatLabel(LABELS.confirmActivateCouponBody, {
            code: row.code,
          })}
          onConfirm={setStatus(COUPON_STATUS.ACTIVE)}
        />
      ) : null}
      {!readOnly && row.status !== COUPON_STATUS.ARCHIVED ? (
        <AdminConfirmAction
          label={LABELS.archiveCoupon}
          tone="archive"
          dialogVariant="warning"
          title={LABELS.confirmArchiveCouponTitle}
          description={formatLabel(LABELS.confirmArchiveCouponBody, {
            code: row.code,
          })}
          onConfirm={setStatus(COUPON_STATUS.ARCHIVED)}
        />
      ) : null}
      {allowReject &&
      row.vendorId &&
      (row.status === COUPON_STATUS.PENDING_APPROVAL ||
        row.status === COUPON_STATUS.ACTIVE ||
        row.status === COUPON_STATUS.PAUSED) ? (
        <AdminConfirmAction
          label={LABELS.rejectCoupon}
          tone="danger"
          dialogVariant="danger"
          requireReason
          reasonLabel={LABELS.rejectionReason}
          reasonHint={LABELS.couponRejectReasonHint}
          title={LABELS.confirmRejectCouponTitle}
          description={formatLabel(LABELS.confirmRejectCouponBody, {
            code: row.code,
          })}
          onConfirm={setStatus(COUPON_STATUS.REJECTED)}
        />
      ) : null}
    </>
  );
}
