"use client";

import {
  BarChart2,
  Check,
  CircleX,
  Eye,
  Pause,
  Pencil,
  Play,
} from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
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

const REJECTABLE: readonly string[] = [
  COUPON_STATUS.PENDING_APPROVAL,
  COUPON_STATUS.ACTIVE,
  COUPON_STATUS.PAUSED,
];

/** View, analytics, edit and the status changes the rules allow for one coupon. */
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
  const confirmBody = (template: string) =>
    formatLabel(template, { code: row.code });
  const canResume =
    row.status === COUPON_STATUS.PAUSED || row.status === COUPON_STATUS.DRAFT;

  return (
    <>
      <RowActionButton
        kind="view"
        icon={Eye}
        label={LABELS.viewCoupon}
        onClick={openDetail}
      />
      <RowActionButton
        icon={BarChart2}
        label={LABELS.viewAnalytics}
        onClick={openAnalytics}
      />
      {!readOnly && row.status !== COUPON_STATUS.ARCHIVED ? (
        <RowActionButton
          kind="edit"
          icon={Pencil}
          label={LABELS.editCoupon}
          onClick={openEdit}
        />
      ) : null}
      {allowReject && row.status === COUPON_STATUS.PENDING_APPROVAL ? (
        <AdminConfirmAction
          label={LABELS.approveCoupon}
          icon={Check}
          tone="success"
          dialogVariant="success"
          title={LABELS.confirmApproveCouponTitle}
          description={confirmBody(LABELS.confirmApproveCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.ACTIVE)}
        />
      ) : null}
      {!readOnly && row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          icon={Pause}
          tone="neutral"
          dialogVariant="warning"
          title={LABELS.confirmPauseCouponTitle}
          description={confirmBody(LABELS.confirmPauseCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.PAUSED)}
        />
      ) : null}
      {!readOnly && canResume ? (
        <AdminConfirmAction
          label={LABELS.activateCoupon}
          icon={Play}
          tone="success"
          dialogVariant="success"
          title={LABELS.confirmActivateCouponTitle}
          description={confirmBody(LABELS.confirmActivateCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.ACTIVE)}
        />
      ) : null}
      {!readOnly && row.status !== COUPON_STATUS.ARCHIVED ? (
        <AdminConfirmAction
          label={LABELS.archiveCoupon}
          tone="archive"
          dialogVariant="warning"
          title={LABELS.confirmArchiveCouponTitle}
          description={confirmBody(LABELS.confirmArchiveCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.ARCHIVED)}
        />
      ) : null}
      {allowReject && row.vendorId && REJECTABLE.includes(row.status) ? (
        <AdminConfirmAction
          label={LABELS.rejectCoupon}
          icon={CircleX}
          tone="danger"
          dialogVariant="danger"
          requireReason
          reasonLabel={LABELS.rejectionReason}
          reasonHint={LABELS.couponRejectReasonHint}
          title={LABELS.confirmRejectCouponTitle}
          description={confirmBody(LABELS.confirmRejectCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.REJECTED)}
        />
      ) : null}
    </>
  );
}
