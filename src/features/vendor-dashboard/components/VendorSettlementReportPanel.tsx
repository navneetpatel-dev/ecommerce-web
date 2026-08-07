'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { LABELS } from '@/shared/constants/labels'
import { formatInr } from '@/features/orders/utils/format'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { reportsApi, type VendorReportSummary } from '@/features/admin-dashboard/api/reports.api'
import { useAuthStore } from '@/features/auth/store/auth.store'

function defaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

export function VendorSettlementReportPanel() {
  const vendorId = useAuthStore((s) => s.currentUser?.vendorId)
  const initial = useMemo(() => defaultRange(), [])
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<VendorReportSummary | null>(null)

  const load = async () => {
    if (!vendorId) return
    setLoading(true)
    setError(null)
    try {
      const data = await reportsApi.vendorSummary(vendorId, {
        from: `${from}T00:00:00.000Z`,
        to: `${to}T23:59:59.999Z`,
      })
      setSummary(data)
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport))
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4 rounded-md border border-line bg-surface p-4">
      <h2 className="text-[1rem] font-semibold text-ink">{LABELS.settlementReports}</h2>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="vendor-report-from">{LABELS.reportDateFrom}</Label>
          <Input
            id="vendor-report-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor-report-to">{LABELS.reportDateTo}</Label>
          <Input
            id="vendor-report-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <Button onClick={() => void load()} disabled={loading || !vendorId}>
          {LABELS.reportLoad}
        </Button>
      </div>

      {error ? <p className="text-[0.9375rem] text-danger">{error}</p> : null}
      {loading ? <p className="text-[0.9375rem] text-ink-muted">{LABELS.loading}</p> : null}
      {!loading && !error && !summary ? (
        <p className="text-[0.9375rem] text-ink-muted">{LABELS.noReportData}</p>
      ) : null}

      {summary ? (
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-[0.8125rem] text-ink-muted">{LABELS.grossSales}</dt>
            <dd className="font-semibold tabular-nums">{formatInr(summary.sales)}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-muted">{LABELS.commissionCharged}</dt>
            <dd className="font-semibold tabular-nums">{formatInr(summary.commissionDeducted)}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-muted">{LABELS.tcsCollected}</dt>
            <dd className="font-semibold tabular-nums">{formatInr(summary.tcsDeducted)}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-muted">{LABELS.ownCouponDiscounts}</dt>
            <dd className="font-semibold tabular-nums">
              {formatInr(summary.discountAbsorbed.ownCoupons)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-muted">{LABELS.platformCouponDiscounts}</dt>
            <dd className="font-semibold tabular-nums">
              {formatInr(summary.discountAbsorbed.platformCouponsOnMyItems)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-muted">{LABELS.upcomingPayout}</dt>
            <dd className="font-semibold tabular-nums">{formatInr(summary.upcomingPayout)}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-muted">{LABELS.historicalPayout}</dt>
            <dd className="font-semibold tabular-nums">{formatInr(summary.historicalPayout)}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  )
}
