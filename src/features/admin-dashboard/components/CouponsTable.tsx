"use client";

import {
  DataTable,
  type DataTableColumn,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS, DISCOUNT_BEARER } from "@/shared/constants/statuses";
import { formatDateTime } from "@/shared/utils/formatDate";
import { formatLabel } from "@/shared/utils/formatLabel";
import { AdminConfirmAction } from "./AdminConfirmAction";
import { useCouponRowActions } from "../hooks/useCouponRowActions";
import type { Coupon, CouponAnalytics } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface CouponsTableProps {
  coupons?: Coupon[];
  loading?: boolean;
  pagination?: DataTablePaginationProps;
  /** When true, hide create/edit-style status mutations except moderation reject. */
  readOnly?: boolean;
  /** Allow reject on vendor-oversight rows (admin moderation). */
  allowReject?: boolean;
}

function bearerLabel(bearer: Coupon["discountBearer"]) {
  return bearer === DISCOUNT_BEARER.VENDOR
    ? LABELS.discountBearerVendor
    : LABELS.discountBearerPlatform;
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
      id: "bearer",
      header: LABELS.discountBearer,
      cell: (row) => bearerLabel(row.discountBearer),
    },
    {
      id: "vendor",
      header: LABELS.vendorId,
      className: "font-mono text-[0.8125rem]",
      cell: (row) => row.vendorId ?? "—",
    },
    {
      id: "usage",
      header: LABELS.couponUsage,
      className: "font-mono text-[0.8125rem]",
      truncate: false,
      cell: (row) =>
        `${row.usedCount}/${row.usageLimitTotal ?? LABELS.usageUnlimited}`,
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

      <Dialog
        open={Boolean(analyticsCoupon)}
        onOpenChange={(open) => !open && setAnalyticsCouponId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {LABELS.couponAnalytics}
              {analyticsCoupon ? ` — ${analyticsCoupon.code}` : ""}
            </DialogTitle>
          </DialogHeader>
          {rowActions.analyticsLoading ? (
            <p className="text-[0.875rem] text-ink-muted">{LABELS.loading}</p>
          ) : analytics ? (
            <dl className="space-y-3 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.redemptionCount}</dt>
                <dd className="tabular-nums font-medium">
                  {analytics.usedCount}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.discountCostImpact}</dt>
                <dd className="tabular-nums font-medium">
                  ₹{formatInrAmount(Number(analytics.totalDiscount))}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.revenueImpact}</dt>
                <dd className="tabular-nums font-medium">
                  ₹{formatInrAmount(Number(analytics.revenueImpact ?? 0))}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.conversionRate}</dt>
                <dd className="tabular-nums font-medium">
                  {analytics.conversionRate == null
                    ? "—"
                    : `${Math.round(Number(analytics.conversionRate) * 100)}%`}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.couponUsage}</dt>
                <dd className="tabular-nums font-medium">
                  {analytics.usedCountCached}/
                  {analytics.usageLimitTotal ?? LABELS.usageUnlimited}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-[0.875rem] text-ink-muted">
              {LABELS.couldNotLoadData}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
