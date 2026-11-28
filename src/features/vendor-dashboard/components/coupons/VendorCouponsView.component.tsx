"use client";

import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import {
  CouponDetailDialog,
  CouponsFilters,
  EditCouponDialog,
  type CouponsFiltersProps,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import { LABELS } from "@/shared/constants/labels";
import type { UseFormReturn } from "react-hook-form";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { VendorCouponRowActions } from "./VendorCouponsView/VendorCouponRowActions.component";
import { CouponAnalyticsDialog } from "./VendorCouponsView/CouponAnalyticsDialog.component";
import { CouponsHeaderSection } from "./VendorCouponsView/CouponsHeaderSection.component";
import { buildVendorCouponColumns } from "./VendorCouponsView/vendorCouponColumns.component";
import { vendorCouponsViewStyles } from "../../styles/coupons/vendorCouponsView.styles";

interface VendorCouponsViewProps {
  coupons: Coupon[];
  loading: boolean;
  pagination: DataTablePaginationProps;
  filters?: CouponsFiltersProps;
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CouponFormInput>;
  isPending: boolean;
  formLevelError?: string | null;
  onSubmit: (data: CouponFormInput) => void;
  vendorId?: string | null;
  analyticsId: string | null;
  setAnalyticsId: (id: string | null) => void;
  analytics?: CouponAnalytics;
  analyticsLoading: boolean;
  absorbedDiscountTotal?: number | null;
  onUpdateStatus: (coupon: Coupon, status: Coupon["status"]) => Promise<void>;
  detailCoupon: Coupon | null;
  setDetailCoupon: (coupon: Coupon | null) => void;
  editCoupon: Coupon | null;
  setEditCoupon: (coupon: Coupon | null) => void;
  saveCoupon: (values: CouponFormInput, coupon: Coupon) => Promise<unknown>;
}

/** Vendor coupons screen: header + table with status actions + analytics. */
export function VendorCouponsView(props: VendorCouponsViewProps) {
  const {
    coupons,
    loading,
    pagination,
    filters,
    open,
    setOpen,
    form,
    isPending,
    formLevelError = null,
    onSubmit,
    vendorId = null,
    analyticsId,
    setAnalyticsId,
    analytics,
    analyticsLoading,
    absorbedDiscountTotal = null,
    onUpdateStatus,
    detailCoupon,
    setDetailCoupon,
    editCoupon,
    setEditCoupon,
    saveCoupon,
  } = props;
  const closeDetail = () => setDetailCoupon(null);
  const closeEdit = () => setEditCoupon(null);
  const columns = buildVendorCouponColumns();

  const renderActions = (row: Coupon) => (
    <VendorCouponRowActions
      row={row}
      onUpdateStatus={onUpdateStatus}
      onAnalytics={setAnalyticsId}
      onDetail={setDetailCoupon}
      onEdit={setEditCoupon}
    />
  );

  return (
    <div className={vendorCouponsViewStyles.stack}>
      <CouponsHeaderSection
        absorbedDiscountTotal={absorbedDiscountTotal}
        open={open}
        setOpen={setOpen}
        form={form}
        isPending={isPending}
        formLevelError={formLevelError}
        onSubmit={onSubmit}
        vendorId={vendorId}
      />

      {filters ? <CouponsFilters {...filters} /> : null}

      <DataTable
        ariaLabel={LABELS.vendorCouponsTableAria}
        columns={columns}
        rows={coupons}
        loading={loading}
        emptyMessage={LABELS.noVendorCoupons}
        getRowId={(row) => row.id}
        pagination={pagination}
        actions={renderActions}
        rowDetails={false}
      />

      <CouponDetailDialog coupon={detailCoupon} onClose={closeDetail} />
      {editCoupon ? (
        <EditCouponDialog
          key={editCoupon.id}
          coupon={editCoupon}
          onClose={closeEdit}
          onSave={saveCoupon}
          vendorMode
          vendorId={vendorId}
        />
      ) : null}

      <CouponAnalyticsDialog
        analyticsId={analyticsId}
        setAnalyticsId={setAnalyticsId}
        analytics={analytics}
        analyticsLoading={analyticsLoading}
      />
    </div>
  );
}
