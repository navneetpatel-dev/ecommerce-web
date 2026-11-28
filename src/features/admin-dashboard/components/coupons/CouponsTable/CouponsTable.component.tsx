"use client";

import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { useCouponRowActions } from "../../../hooks/coupons/useCouponRowActions.hook";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { CouponsAnalyticsDialog } from "./CouponsAnalyticsDialog.component";
import { buildCouponColumns } from "./couponTableColumns.component";
import { CouponRowActions } from "./CouponRowActions.component";
import { CouponDetailDialog } from "../CouponDialogs/CouponDetailDialog.component";
import { EditCouponDialog } from "../CouponDialogs/EditCouponDialog.component";

interface CouponsTableProps {
  coupons?: Coupon[];
  loading?: boolean;
  pagination?: DataTablePaginationProps;
  /** When true, hide create/edit-style status mutations except moderation. */
  readOnly?: boolean;
  /** Approve or reject vendor coupons (admin moderation). */
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

  const columns = buildCouponColumns({ vendorTab: allowReject });
  const closeAnalytics = () => setAnalyticsCouponId(null);
  const closeDetail = () => rowActions.setDetailCoupon(null);
  const closeEdit = () => rowActions.setEditCoupon(null);

  const renderActions = (row: Coupon) => (
    <CouponRowActions
      row={row}
      readOnly={readOnly}
      allowReject={allowReject}
      rowActions={rowActions}
    />
  );

  const analytics: CouponAnalytics | undefined = rowActions.analytics;
  const analyticsCoupon =
    coupons.find((row) => row.id === analyticsCouponId) ?? null;

  return (
    <>
      <DataTable
        ariaLabel={LABELS.couponsTableAria}
        columns={columns}
        rows={coupons}
        loading={loading}
        emptyMessage={readOnly ? LABELS.noVendorCoupons : LABELS.noCoupons}
        getRowId={(row) => row.id}
        pagination={pagination}
        actions={renderActions}
        rowDetails={false}
        tableId="admin-coupons"
        enableColumnVisibility
        enableDensityToggle
        enableExport
        enableSorting
        enableFullscreen
      />

      <CouponDetailDialog
        coupon={rowActions.detailCoupon}
        onClose={closeDetail}
      />
      {rowActions.editCoupon ? (
        <EditCouponDialog
          key={rowActions.editCoupon.id}
          coupon={rowActions.editCoupon}
          onClose={closeEdit}
          onSave={rowActions.saveCoupon}
        />
      ) : null}

      <CouponsAnalyticsDialog
        analyticsCoupon={analyticsCoupon}
        analytics={analytics}
        loading={rowActions.analyticsLoading}
        onClose={closeAnalytics}
      />
    </>
  );
}
