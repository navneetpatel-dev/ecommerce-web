"use client";

import { BarChart2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import {
  AdminConfirmAction,
  EditCouponAction,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import { couponsApi } from "@/features/coupons";
import { vendorCouponKeys } from "../../api/coupons/vendor-coupons.queries";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { UseFormReturn } from "react-hook-form";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { CouponAnalyticsDialog } from "./VendorCouponsView/CouponAnalyticsDialog.component";
import { CouponsHeaderSection } from "./VendorCouponsView/CouponsHeaderSection.component";
import { buildVendorCouponColumns } from "./VendorCouponsView/vendorCouponColumns.component";
import { vendorCouponsViewStyles } from "../../styles/coupons/vendorCouponsView.styles";

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
}

const saveVendorCoupon = (id: string, body: unknown) =>
  couponsApi.vendorUpdate(id, body);

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
  } = props;

  const columns = buildVendorCouponColumns();

  const renderActions = (row: Coupon) => {
    const setStatus = (status: Coupon["status"]) => () =>
      onUpdateStatus(row, status);
    const openAnalytics = () => setAnalyticsId(row.id);

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
        {row.status !== COUPON_STATUS.ARCHIVED &&
        row.status !== COUPON_STATUS.REJECTED ? (
          <EditCouponAction
            coupon={row}
            save={saveVendorCoupon}
            invalidateKey={vendorCouponKeys.all}
            forceVendorId={vendorId}
            vendorMode
          />
        ) : null}
        {row.status === COUPON_STATUS.ACTIVE ? (
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
        {row.status === COUPON_STATUS.PAUSED ||
        row.status === COUPON_STATUS.DRAFT ? (
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
        {row.status !== COUPON_STATUS.ARCHIVED ? (
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
  };

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

      <DataTable
        ariaLabel={LABELS.vendorCouponsTableAria}

        columns={columns}
        rows={coupons}
        loading={loading}
        emptyMessage={LABELS.noVendorCoupons}
        getRowId={(row) => row.id}
        pagination={pagination}
        actions={renderActions}
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
