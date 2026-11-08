"use client";

import { BarChart2, Eye, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { AdminConfirmAction } from "@/features/admin-dashboard";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Coupon } from "@/shared/api/types";

interface VendorCouponRowActionsProps {
  row: Coupon;
  canManage: boolean;
  onUpdateStatus: (coupon: Coupon, status: Coupon["status"]) => Promise<void>;
  onAnalytics: (id: string | null) => void;
  onDetail: (coupon: Coupon | null) => void;
  onEdit: (coupon: Coupon | null) => void;
}

export function VendorCouponRowActions({
  row,
  canManage,
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
      {canManage && row.status !== COUPON_STATUS.ARCHIVED ? (
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
      {canManage && row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          tone="neutral"
          title={LABELS.confirmPauseCouponTitle}
          description={formatLabel(LABELS.confirmPauseCouponBody, {
            code: row.code,
          })}
          onConfirm={setStatus(COUPON_STATUS.PAUSED)}
        />
      ) : null}
      {canManage && row.status === COUPON_STATUS.PAUSED ? (
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
      {canManage && row.status !== COUPON_STATUS.ARCHIVED ? (
        <AdminConfirmAction
          label={LABELS.archiveCoupon}
          tone="archive"
          title={LABELS.confirmArchiveCouponTitle}
          description={formatLabel(LABELS.confirmArchiveCouponBody, {
            code: row.code,
          })}
          onConfirm={setStatus(COUPON_STATUS.ARCHIVED)}
        />
      ) : null}
    </>
  );
}
