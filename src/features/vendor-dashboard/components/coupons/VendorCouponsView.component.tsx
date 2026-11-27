"use client";

import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import { type CouponFormInput } from "@/features/admin-dashboard";
import { LABELS, ROLES } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { UseFormReturn } from "react-hook-form";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { VendorCouponRowActions } from "./VendorCouponsView/VendorCouponRowActions.component";
import { CouponAnalyticsDialog } from "./VendorCouponsView/CouponAnalyticsDialog.component";
import { CouponsHeaderSection } from "./VendorCouponsView/CouponsHeaderSection.component";
import {
  CouponsFilters,
  type CouponsFiltersProps,
} from "@/features/admin-dashboard";
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
  } = props;

  const isOwner = useAuthStore(
    (s) => s.currentUser?.role === ROLES.VENDOR_OWNER,
  );
  const columns = buildVendorCouponColumns();

  const renderActions = (row: Coupon) => (
    <VendorCouponRowActions
      coupon={row}
      isOwner={isOwner}
      vendorId={vendorId}
      onOpenAnalytics={setAnalyticsId}
      onUpdateStatus={onUpdateStatus}
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
        canManage={isOwner}
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
        fetchRowDetail={async (row) =>
          row as unknown as Record<string, unknown>
        }
      />

      <CouponAnalyticsDialog
        analyticsId={analyticsId}
        setAnalyticsId={setAnalyticsId}
        analytics={analytics}
        analyticsLoading={analyticsLoading}
      />
    </div>
  );
}
