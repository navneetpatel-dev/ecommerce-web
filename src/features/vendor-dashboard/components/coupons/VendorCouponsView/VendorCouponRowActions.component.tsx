"use client";

import { BarChart2, Pause, Play } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import {
  AdminConfirmAction,
  EditCouponAction,
} from "@/features/admin-dashboard";
import { couponsApi } from "@/features/coupons";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Coupon } from "@/shared/api/types";
import { vendorCouponKeys } from "../../../api/coupons/vendor-coupons.queries";

const saveVendorCoupon = (id: string, body: unknown) =>
  couponsApi.vendorUpdate(id, body);

interface VendorCouponRowActionsProps {
  coupon: Coupon;
  /** Staff may read analytics; only the owner changes coupons. */
  isOwner: boolean;
  vendorId: string | null;
  onOpenAnalytics: (id: string) => void;
  onUpdateStatus: (coupon: Coupon, status: Coupon["status"]) => Promise<void>;
}

/** Analytics, edit and status changes for one vendor coupon row. */
export function VendorCouponRowActions({
  coupon,
  isOwner,
  vendorId,
  onOpenAnalytics,
  onUpdateStatus,
}: VendorCouponRowActionsProps) {
  const setStatus = (status: Coupon["status"]) => () =>
    onUpdateStatus(coupon, status);
  const openAnalytics = () => onOpenAnalytics(coupon.id);
  const analyticsAction = (
    <RowActionButton
      icon={BarChart2}
      label={LABELS.viewAnalytics}
      onClick={openAnalytics}
    />
  );

  if (!isOwner) return analyticsAction;

  const confirmBody = (template: string) =>
    formatLabel(template, { code: coupon.code });

  return (
    <>
      {analyticsAction}
      {coupon.status !== COUPON_STATUS.ARCHIVED &&
      coupon.status !== COUPON_STATUS.REJECTED ? (
        <EditCouponAction
          coupon={coupon}
          save={saveVendorCoupon}
          invalidateKey={vendorCouponKeys.all}
          forceVendorId={vendorId}
          vendorMode
        />
      ) : null}
      {coupon.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          icon={Pause}
          tone="neutral"
          title={LABELS.confirmPauseCouponTitle}
          description={confirmBody(LABELS.confirmPauseCouponBody)}
          onConfirm={setStatus(COUPON_STATUS.PAUSED)}
        />
      ) : null}
      {coupon.status === COUPON_STATUS.PAUSED ||
      coupon.status === COUPON_STATUS.DRAFT ? (
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
      {coupon.status !== COUPON_STATUS.ARCHIVED ? (
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
