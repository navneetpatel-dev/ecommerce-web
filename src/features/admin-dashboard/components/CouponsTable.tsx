'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DataTable, type DataTableColumn, type DataTablePaginationProps } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { LABELS } from '@/shared/constants/labels'
import { COUPON_STATUS, DISCOUNT_BEARER } from '@/shared/constants/statuses'
import { formatDateTime } from '@/shared/utils/formatDate'
import { formatLabel } from '@/shared/utils/formatLabel'
import { AdminConfirmAction } from './AdminConfirmAction'
import { adminApi } from '../api/admin.api'
import type { Coupon, CouponAnalytics } from '@/shared/api/types'

interface CouponsTableProps {
  coupons?: Coupon[]
  loading?: boolean
  pagination?: DataTablePaginationProps
  /** When true, hide create/edit-style status mutations except moderation reject. */
  readOnly?: boolean
  /** Allow reject on vendor-oversight rows (admin moderation). */
  allowReject?: boolean
}

function bearerLabel(bearer: Coupon['discountBearer']) {
  return bearer === DISCOUNT_BEARER.VENDOR
    ? LABELS.discountBearerVendor
    : LABELS.discountBearerPlatform
}

export function CouponsTable({
  coupons = [],
  loading = false,
  pagination,
  readOnly = false,
  allowReject = false,
}: CouponsTableProps) {
  const queryClient = useQueryClient()
  const [analyticsCoupon, setAnalyticsCoupon] = useState<Coupon | null>(null)

  const analyticsQuery = useQuery({
    queryKey: ['admin', 'coupon-analytics', analyticsCoupon?.id],
    queryFn: () => adminApi.couponAnalytics(analyticsCoupon!.id),
    enabled: Boolean(analyticsCoupon?.id),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Coupon['status'] }) =>
      adminApi.updateCouponStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    },
  })

  const reload = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
  }

  const columns: DataTableColumn<Coupon>[] = [
    {
      id: 'code',
      header: LABELS.couponCode,
      className: 'font-mono',
      cell: (row) => row.code,
    },
    {
      id: 'type',
      header: LABELS.couponType,
      accessor: 'type',
    },
    {
      id: 'bearer',
      header: LABELS.discountBearer,
      cell: (row) => bearerLabel(row.discountBearer),
    },
    {
      id: 'vendor',
      header: LABELS.vendorId,
      className: 'font-mono text-[0.8125rem]',
      cell: (row) => row.vendorId ?? '—',
    },
    {
      id: 'usage',
      header: LABELS.couponUsage,
      className: 'font-mono text-[0.8125rem]',
      truncate: false,
      cell: (row) =>
        `${row.usedCount}/${row.usageLimitTotal ?? LABELS.usageUnlimited}`,
    },
    {
      id: 'status',
      header: LABELS.status,
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'expires',
      header: LABELS.expires,
      cell: (row) => formatDateTime(row.endDate),
    },
  ]

  const renderActions = (row: Coupon) => (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setAnalyticsCoupon(row)}
      >
        {LABELS.viewAnalytics}
      </Button>
      {!readOnly && row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          tone="neutral"
          dialogVariant="warning"
          title={LABELS.confirmPauseCouponTitle}
          description={formatLabel(LABELS.confirmPauseCouponBody, { code: row.code })}
          onConfirm={() =>
            statusMutation.mutateAsync({ id: row.id, status: COUPON_STATUS.PAUSED }).then(reload)
          }
        />
      ) : null}
      {!readOnly &&
      (row.status === COUPON_STATUS.PAUSED || row.status === COUPON_STATUS.DRAFT) ? (
        <AdminConfirmAction
          label={LABELS.activateCoupon}
          tone="success"
          dialogVariant="success"
          title={LABELS.confirmActivateCouponTitle}
          description={formatLabel(LABELS.confirmActivateCouponBody, { code: row.code })}
          onConfirm={() =>
            statusMutation.mutateAsync({ id: row.id, status: COUPON_STATUS.ACTIVE }).then(reload)
          }
        />
      ) : null}
      {!readOnly && row.status !== COUPON_STATUS.ARCHIVED ? (
        <AdminConfirmAction
          label={LABELS.archiveCoupon}
          tone="archive"
          dialogVariant="warning"
          title={LABELS.confirmArchiveCouponTitle}
          description={formatLabel(LABELS.confirmArchiveCouponBody, { code: row.code })}
          onConfirm={() =>
            statusMutation
              .mutateAsync({ id: row.id, status: COUPON_STATUS.ARCHIVED })
              .then(reload)
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
          description={formatLabel(LABELS.confirmRejectCouponBody, { code: row.code })}
          onConfirm={() =>
            statusMutation
              .mutateAsync({ id: row.id, status: COUPON_STATUS.REJECTED })
              .then(reload)
          }
        />
      ) : null}
    </>
  )

  const analytics: CouponAnalytics | undefined = analyticsQuery.data

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

      <Dialog open={Boolean(analyticsCoupon)} onOpenChange={(open) => !open && setAnalyticsCoupon(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {LABELS.couponAnalytics}
              {analyticsCoupon ? ` — ${analyticsCoupon.code}` : ''}
            </DialogTitle>
          </DialogHeader>
          {analyticsQuery.isLoading ? (
            <p className="text-[0.875rem] text-ink-muted">{LABELS.loading}</p>
          ) : analytics ? (
            <dl className="space-y-3 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.redemptionCount}</dt>
                <dd className="tabular-nums font-medium">{analytics.usedCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.discountCostImpact}</dt>
                <dd className="tabular-nums font-medium">
                  ₹{Number(analytics.totalDiscount).toLocaleString('en-IN')}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.revenueImpact}</dt>
                <dd className="tabular-nums font-medium">
                  ₹{Number(analytics.revenueImpact ?? 0).toLocaleString('en-IN')}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.conversionRate}</dt>
                <dd className="tabular-nums font-medium">
                  {analytics.conversionRate == null
                    ? '—'
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
            <p className="text-[0.875rem] text-ink-muted">{LABELS.couldNotLoadData}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
