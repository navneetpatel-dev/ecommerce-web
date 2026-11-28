"use client";

import { BarChart2, Eye, Pause, Pencil, Play } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { AdminConfirmAction } from "@/features/admin-dashboard";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Coupon } from "@/shared/api/types";

interface VendorCouponRowActionsProps {
  row: Coupon;
  onUpdateStatus: (coupon: Coupon, status: Coupon["status"]) => Promise<void>;
  onAnalytics: (id: string | null) => void;
  onDetail: (coupon: Coupon | null) => void;
  onEdit: (coupon: Coupon | null) => void;
}

/** View, analytics, edit and status changes for one vendor coupon row. */
export function VendorCouponRowActions({
  row,
  onUpdateStatus,
  onAnalytics,
  onDetail,
  onEdit,
}: VendorCouponRowActionsProps) {
  const setStatus = (status: Coupon["status"]) => () =>
    onUpdateStatus(row, status);
  const openAnalytics = () => onAnalytics(row.id);
  const openDetail = () => onDetail(row);
  const openEdit = () => onEdit(row);
  const confirmBody = (template: string) =>
    formatLabel(template, { code: row.code });

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
      {row.status !== COUPON_STATUS.ARCHIVED ? (
        <RowActionButton
          kind="edit"
          icon={Pencil}
          label={LABELS.edit}
          onClick={openEdit}
        />
      ) : null}
      {row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          icon={Pause}
          tone="neutral"
          title={LABELS.confirmPauseCouponTitle}
          description={confirmBody(LABELS.confirmPauseCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.PAUSED)}
        />
      ) : null}
      {row.status === COUPON_STATUS.PAUSED ? (
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
      {row.status !== COUPON_STATUS.ARCHIVED ? (
        <AdminConfirmAction
          label={LABELS.archiveCoupon}
          tone="archive"
          title={LABELS.confirmArchiveCouponTitle}
          description={confirmBody(LABELS.confirmArchiveCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.ARCHIVED)}
        />
      ) : null}
    </>
  );
}
