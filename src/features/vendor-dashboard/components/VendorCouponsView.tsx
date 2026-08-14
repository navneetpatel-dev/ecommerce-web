'use client'

import { Button } from '@/shared/components/ui/button'
import { ButtonGroup } from '@/shared/components/ui/button-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { DataTable, type DataTableColumn, type DataTablePaginationProps } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Plus } from 'lucide-react'
import { CreateCouponForm } from '@/features/admin-dashboard/components/CreateCouponForm'
import { AdminConfirmAction } from '@/features/admin-dashboard/components/AdminConfirmAction'
import { LABELS } from '@/shared/constants/labels'
import { COUPON_STATUS } from '@/shared/constants/statuses'
import { formatDateTime } from '@/shared/utils/formatDate'
import { formatLabel } from '@/shared/utils/formatLabel'
import type { UseFormReturn } from 'react-hook-form'
import type { CouponFormInput } from '@/features/admin-dashboard/schemas/coupons.schema'
import type { Coupon, CouponAnalytics } from '@/shared/api/types'

interface VendorCouponsViewProps {
  coupons: Coupon[]
  loading: boolean
  pagination: DataTablePaginationProps
  open: boolean
  setOpen: (open: boolean) => void
  form: UseFormReturn<CouponFormInput>
  isPending: boolean
  onSubmit: (data: CouponFormInput) => void
  vendorId?: string | null
  analyticsId: string | null
  setAnalyticsId: (id: string | null) => void
  analytics?: CouponAnalytics
  analyticsLoading: boolean
  absorbedDiscountTotal?: number
  onUpdateStatus: (coupon: Coupon, status: Coupon['status']) => Promise<void>
}

export function VendorCouponsView({
  coupons,
  loading,
  pagination,
  open,
  setOpen,
  form,
  isPending,
  onSubmit,
  vendorId = null,
  analyticsId,
  setAnalyticsId,
  analytics,
  analyticsLoading,
  absorbedDiscountTotal = 0,
  onUpdateStatus,
}: VendorCouponsViewProps) {
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
      id: 'usage',
      header: LABELS.couponUsage,
      className: 'font-mono text-[0.8125rem]',
      cell: (row) => `${row.usedCount}/${row.usageLimitTotal ?? LABELS.usageUnlimited}`,
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
      <Button type="button" size="sm" variant="outline" onClick={() => setAnalyticsId(row.id)}>
        {LABELS.viewAnalytics}
      </Button>
      {row.status === COUPON_STATUS.ACTIVE ? (
        <AdminConfirmAction
          label={LABELS.pauseCoupon}
          tone="neutral"
          title={LABELS.confirmPauseCouponTitle}
          description={formatLabel(LABELS.confirmPauseCouponBody, { code: row.code })}
          onConfirm={() => onUpdateStatus(row, COUPON_STATUS.PAUSED)}
        />
      ) : null}
      {row.status === COUPON_STATUS.PAUSED || row.status === COUPON_STATUS.DRAFT ? (
        <AdminConfirmAction
          label={LABELS.activateCoupon}
          tone="success"
          dialogVariant="success"
          title={LABELS.confirmActivateCouponTitle}
          description={formatLabel(LABELS.confirmActivateCouponBody, { code: row.code })}
          onConfirm={() => onUpdateStatus(row, COUPON_STATUS.ACTIVE)}
        />
      ) : null}
      {row.status !== COUPON_STATUS.ARCHIVED ? (
        <AdminConfirmAction
          label={LABELS.archiveCoupon}
          tone="archive"
          title={LABELS.confirmArchiveCouponTitle}
          description={formatLabel(LABELS.confirmArchiveCouponBody, { code: row.code })}
          onConfirm={() => onUpdateStatus(row, COUPON_STATUS.ARCHIVED)}
        />
      ) : null}
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]">{LABELS.coupons}</h2>
          <p className="text-[0.875rem] text-ink-muted">
            {formatLabel(LABELS.absorbedDiscountsSummary, {
              amount: absorbedDiscountTotal.toLocaleString('en-IN'),
            })}{' '}
            ({LABELS.absorbedThisPeriod})
          </p>
        </div>
        <ButtonGroup>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button type="button" size="sm" fullWidth="mobile" onClick={() => setOpen(true)}>
            <Plus aria-hidden /> {LABELS.createVendorCoupon}
          </Button>
          <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{LABELS.createVendorCoupon}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(onSubmit, () => {
                void form.trigger()
              })}
            >
              <CreateCouponForm
                form={form}
                isPending={isPending}
                vendorMode
                vendorId={vendorId}
              />
            </form>
          </DialogContent>
        </Dialog>
        </ButtonGroup>
      </div>

      <DataTable
        columns={columns}
        rows={coupons}
        loading={loading}
        emptyMessage={LABELS.noVendorCoupons}
        getRowId={(row) => row.id}
        pagination={pagination}
        actions={renderActions}
      />

      <Dialog open={Boolean(analyticsId)} onOpenChange={(next) => !next && setAnalyticsId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{LABELS.couponAnalytics}</DialogTitle>
          </DialogHeader>
          {analyticsLoading ? (
            <p className="text-[0.875rem] text-ink-muted">{LABELS.loading}</p>
          ) : analytics ? (
            <dl className="space-y-3 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.redemptionCount}</dt>
                <dd className="tabular-nums font-medium">{analytics.usedCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.absorbedDiscounts}</dt>
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
              <p className="text-[0.8125rem] text-ink-muted">
                {formatLabel(LABELS.absorbedDiscountsSummary, {
                  amount: Number(analytics.totalDiscount).toLocaleString('en-IN'),
                })}
              </p>
            </dl>
          ) : (
            <p className="text-[0.875rem] text-ink-muted">{LABELS.couldNotLoadData}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
