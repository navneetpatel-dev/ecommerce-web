"use client";

import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatLabel";
import { AdminConfirmAction } from "../AdminConfirmAction";
import { useCouponRowActions } from "../../hooks/useCouponRowActions";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { CouponsAnalyticsDialog } from "./CouponsAnalyticsDialog";
import { buildCouponColumns } from "./couponTableColumns";

interface CouponsTableProps {
  coupons?: Coupon[];
  loading?: boolean;
  pagination?: DataTablePaginationProps;
  /** When true, hide create/edit-style status mutations except moderation reject. */
  readOnly?: boolean;
  /** Allow reject on vendor-oversight rows (admin moderation). */
  allowReject?: boolean;
}

export function CouponsTable({
  coupons = [],
  loading = false,
  pagination,
  readOnly = false,
  allowReject = false,
}: CouponsTableProps) {
  const rowActions = useCouponRowActions();
  const analyticsCouponId = rowActions.analyticsCouponId;
  const setAnalyticsCouponId = rowActions.setAnalyticsCouponId;

  const columns = buildCouponColumns();

  const renderActions = (row: Coupon) => (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setAnalyticsCouponId(row.id)}
      >
        {LABELS.viewAnalytics}
      </Button>
      {!readOnly && row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          tone="neutral"
          dialogVariant="warning"
          title={LABELS.confirmPauseCouponTitle}
          description={formatLabel(LABELS.confirmPauseCouponBody, {
            code: row.code,
          })}
          onConfirm={() =>
            rowActions.changeStatus({
              id: row.id,
              status: COUPON_STATUS.PAUSED,
            })
          }
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
          onConfirm={() =>
            rowActions.changeStatus({
              id: row.id,
              status: COUPON_STATUS.ACTIVE,
            })
          }
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
          onConfirm={() =>
            rowActions.changeStatus({
              id: row.id,
              status: COUPON_STATUS.ARCHIVED,
            })
          }
        />
      ) : null}
      {allowReject &&
      row.vendorId &&
      row.status !== COUPON_STATUS.REJECTED &&
      row.status !== COUPON_STATUS.ARCHIVED ? (
        <AdminConfirmAction
          label={LABELS.rejectCoupon}
          tone="danger"
          dialogVariant="danger"
          title={LABELS.confirmRejectCouponTitle}
          description={formatLabel(LABELS.confirmRejectCouponBody, {
            code: row.code,
          })}
          onConfirm={() =>
            rowActions.changeStatus({
              id: row.id,
              status: COUPON_STATUS.REJECTED,
            })
          }
        />
      ) : null}
    </>
  );

  const analytics: CouponAnalytics | undefined = rowActions.analytics;
  const analyticsCoupon =
    coupons.find((row) => row.id === analyticsCouponId) ?? null;

  return (
    <>
      <DataTable
        columns={columns}
        rows={coupons}
        loading={loading}
        emptyMessage={readOnly ? LABELS.noVendorCoupons : LABELS.noCoupons}
        getRowId={(row) => row.id}
        pagination={pagination}
        actions={renderActions}
      />

      <CouponsAnalyticsDialog
        analyticsCoupon={analyticsCoupon}
        analytics={analytics}
        loading={rowActions.analyticsLoading}
        onClose={() => setAnalyticsCouponId(null)}
      />
    </>
  );
}
