"use client";

import {
  DataTable,
  type DataTableColumn,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import {
  CouponDetailDialog,
  CouponStatusCell,
  CouponTableFilters,
  EditCouponDialog,
  couponScopeLabel,
  couponTypeLabel,
  couponValueLabel,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import type { useCouponFilters } from "@/features/admin-dashboard";
import { LABELS } from "@/shared/constants/labels";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import type { UseFormReturn } from "react-hook-form";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { VendorCouponRowActions } from "./VendorCouponsView/VendorCouponRowActions.component";
import { CouponAnalyticsDialog } from "./VendorCouponsView/CouponAnalyticsDialog.component";
import { CouponsHeaderSection } from "./VendorCouponsView/CouponsHeaderSection.component";
import { vendorCouponsViewStyles } from "../../styles/coupons/vendorCouponsView.styles";

type CouponFilters = ReturnType<typeof useCouponFilters>;

interface VendorCouponsViewProps {
  coupons: Coupon[];
  loading: boolean;
  pagination: DataTablePaginationProps;
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
  filters: CouponFilters;
  canManage: boolean;
  detailCoupon: Coupon | null;
  setDetailCoupon: (coupon: Coupon | null) => void;
  editCoupon: Coupon | null;
  setEditCoupon: (coupon: Coupon | null) => void;
  saveCoupon: (values: CouponFormInput, coupon: Coupon) => Promise<unknown>;
}

const usageCell = (row: Coupon) =>
  `${row.usedCount}/${row.usageLimitTotal ?? LABELS.usageUnlimited}`;

/** Vendor coupons screen: header + table with status actions + analytics. */
export function VendorCouponsView(props: VendorCouponsViewProps) {
  const {
    coupons,
    loading,
    pagination,
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
    filters,
    canManage,
    detailCoupon,
    setDetailCoupon,
    editCoupon,
    setEditCoupon,
    saveCoupon,
  } = props;
  const closeDetail = () => setDetailCoupon(null);
  const closeEdit = () => setEditCoupon(null);

  const columns: DataTableColumn<Coupon>[] = [
    {
      id: "code",
      header: LABELS.couponCode,
      className: vendorCouponsViewStyles.colMono,
      cell: (row) => row.code,
    },
    {
      id: "type",
      header: LABELS.couponType,
      cell: (row) => couponTypeLabel(row),
    },
    {
      id: "value",
      header: LABELS.valueColumn,
      cell: (row) => couponValueLabel(row),
    },
    {
      id: "scope",
      header: LABELS.scopeColumn,
      cell: (row) => couponScopeLabel(row),
    },
    {
      id: "usage",
      header: LABELS.couponUsage,
      className: vendorCouponsViewStyles.colMonoSm,
      cell: usageCell,
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => <CouponStatusCell coupon={row} />,
    },
    {
      id: "expires",
      header: LABELS.expires,
      cell: (row) => formatDateTime(row.endDate),
    },
  ];

  const renderActions = (row: Coupon) => (
    <VendorCouponRowActions
      row={row}
      canManage={canManage}
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
        canManage={canManage}
      />

      <DataTable
        ariaLabel={LABELS.vendorCouponsTableAria}

        columns={columns}
        rows={coupons}
        loading={loading}
        emptyMessage={LABELS.noVendorCoupons}
        getRowId={(row) => row.id}
        pagination={pagination}
        actions={renderActions}
        toolbar={<CouponTableFilters filters={filters} />}
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
