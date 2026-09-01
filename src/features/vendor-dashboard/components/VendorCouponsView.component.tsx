"use client";

import { Button } from "@/shared/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  AdminConfirmAction,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS } from "@/shared/constants/statuses";
import { formatDateTime } from "@/shared/utils/formatDate";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { UseFormReturn } from "react-hook-form";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { CouponAnalyticsDialog } from "./VendorCouponsView/CouponAnalyticsDialog.component";
import { CouponsHeaderSection } from "./VendorCouponsView/CouponsHeaderSection.component";

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
  absorbedDiscountTotal?: number;
  onUpdateStatus: (coupon: Coupon, status: Coupon["status"]) => Promise<void>;
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
    absorbedDiscountTotal = 0,
    onUpdateStatus,
  } = props;

  const columns: DataTableColumn<Coupon>[] = [
    {
      id: "code",
      header: LABELS.couponCode,
      className: "font-mono",
      cell: (row) => row.code,
    },
    {
      id: "type",
      header: LABELS.couponType,
      accessor: "type",
    },
    {
      id: "usage",
      header: LABELS.couponUsage,
      className: "font-mono text-body-sm",
      cell: usageCell,
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "expires",
      header: LABELS.expires,
      cell: (row) => formatDateTime(row.endDate),
    },
  ];

  const renderActions = (row: Coupon) => (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setAnalyticsId(row.id)}
      >
        {LABELS.viewAnalytics}
      </Button>
      {row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          tone="neutral"
          title={LABELS.confirmPauseCouponTitle}
          description={formatLabel(LABELS.confirmPauseCouponBody, {
            code: row.code,
          })}
          onConfirm={() => onUpdateStatus(row, COUPON_STATUS.PAUSED)}
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
          onConfirm={() => onUpdateStatus(row, COUPON_STATUS.ACTIVE)}
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
          onConfirm={() => onUpdateStatus(row, COUPON_STATUS.ARCHIVED)}
        />
      ) : null}
    </>
  );

  return (
    <div className="space-y-6">
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
