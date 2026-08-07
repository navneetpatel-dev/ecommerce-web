'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { LABELS } from '@/shared/constants/labels'
import { BEARER_PREFIX } from '@/shared/constants/http'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { formatInr } from '@/features/orders/utils/format'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { API } from '@/shared/constants/apiRoutes'
import { useAuthStore } from '@/features/auth/store/auth.store'
import {
  reportsApi,
  type AdminReportSummary,
  type ReconciliationReport,
  type VendorSettlementRow,
} from '../api/reports.api'

function defaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.8125rem] text-ink-muted">{label}</p>
      <p className="text-[1.125rem] font-semibold tabular-nums text-ink">{value}</p>
    </div>
  )
}

async function downloadReport(path: string, filename: string) {
  const token =
    useAuthStore.getState().accessToken ||
    (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null)
  const base = process.env.NEXT_PUBLIC_API_URL ?? ''
  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  })
  if (!res.ok) throw new Error(LABELS.couldNotLoadReport)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function AdminSettlementReportsPanel() {
  const initial = useMemo(() => defaultRange(), [])
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<AdminReportSummary | null>(null)
  const [vendors, setVendors] = useState<VendorSettlementRow[]>([])
  const [recon, setRecon] = useState<ReconciliationReport | null>(null)

  const range = { from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` }

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [summaryRes, vendorsRes, reconRes] = await Promise.all([
        reportsApi.adminSummary(range),
        reportsApi.adminVendors(range),
        reportsApi.adminReconciliation(range),
      ])
      setSummary(summaryRes)
      setVendors(vendorsRes.vendors)
      setRecon(reconRes)
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport))
      setSummary(null)
      setVendors([])
      setRecon(null)
    } finally {
      setLoading(false)
    }
  }

  const exportFile = async (format: 'csv' | 'pdf') => {
    try {
      await downloadReport(
        reportsApi.exportUrl(API.reports.adminSummary, { ...range, format }),
        `admin-summary.${format === 'pdf' ? 'html' : 'csv'}`,
      )
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="report-from">{LABELS.reportDateFrom}</Label>
          <Input id="report-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="report-to">{LABELS.reportDateTo}</Label>
          <Input id="report-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <Button onClick={() => void load()} disabled={loading}>
          {LABELS.reportLoad}
        </Button>
        <Button variant="outline" disabled={!summary} onClick={() => void exportFile('csv')}>
          {LABELS.exportCsv}
        </Button>
        <Button variant="outline" disabled={!summary} onClick={() => void exportFile('pdf')}>
          {LABELS.exportPdf}
        </Button>
      </div>

      {error ? <p className="text-[0.9375rem] text-danger">{error}</p> : null}
      {loading ? <p className="text-[0.9375rem] text-ink-muted">{LABELS.loading}</p> : null}

      {!loading && !error && !summary ? (
        <p className="text-[0.9375rem] text-ink-muted">{LABELS.noReportData}</p>
      ) : null}

      {summary ? (
        <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={LABELS.platformGmv} value={formatInr(summary.gmv)} />
          <Metric label={LABELS.customerPayments} value={formatInr(summary.customerPayments)} />
          <Metric label={LABELS.commissionEarned} value={formatInr(summary.commissionEarned)} />
          <Metric label={LABELS.taxCollected} value={formatInr(summary.taxCollected)} />
          <Metric label={LABELS.tcsCollected} value={formatInr(summary.tcsCollected)} />
          <Metric label={LABELS.shippingCollected} value={formatInr(summary.shippingCollected)} />
          <Metric
            label={LABELS.discountAbsorbedPlatform}
            value={formatInr(summary.discountAbsorbed.platform)}
          />
          <Metric
            label={LABELS.discountAbsorbedVendor}
            value={formatInr(summary.discountAbsorbed.vendor)}
          />
          <Metric label={LABELS.vendorNetPayouts} value={formatInr(summary.vendorNetPayouts)} />
        </div>
      ) : null}

      {recon ? (
        <div className="rounded-md border border-line bg-surface p-4">
          <h3 className="text-[0.9375rem] font-semibold text-ink">{LABELS.reconciliation}</h3>
          <p
            className={`mt-2 text-[0.9375rem] font-medium ${
              recon.balanced ? 'text-success' : 'text-danger'
            }`}
          >
            {recon.balanced ? LABELS.reconciliationBalanced : LABELS.reconciliationMismatch}
          </p>
          {!recon.balanced ? (
            <p className="mt-1 text-[0.8125rem] text-ink-muted">
              {LABELS.reconciliationDifference}: {formatInr(recon.difference)}
            </p>
          ) : null}
        </div>
      ) : null}

      {vendors.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="min-w-full text-left text-[0.875rem]">
            <thead className="border-b border-line bg-paper/60 text-ink-muted">
              <tr>
                <th className="px-3 py-2 font-medium">{LABELS.vendorName}</th>
                <th className="px-3 py-2 font-medium">{LABELS.grossSales}</th>
                <th className="px-3 py-2 font-medium">{LABELS.discountsAbsorbed}</th>
                <th className="px-3 py-2 font-medium">{LABELS.commissionCharged}</th>
                <th className="px-3 py-2 font-medium">{LABELS.pendingNet}</th>
                <th className="px-3 py-2 font-medium">{LABELS.settledNet}</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((row) => (
                <tr key={row.vendorId} className="border-b border-line/70">
                  <td className="px-3 py-2 text-ink">{row.vendorName}</td>
                  <td className="px-3 py-2 tabular-nums">{formatInr(row.grossSales)}</td>
                  <td className="px-3 py-2 tabular-nums">{formatInr(row.discountsAbsorbed)}</td>
                  <td className="px-3 py-2 tabular-nums">{formatInr(row.commissionCharged)}</td>
                  <td className="px-3 py-2 tabular-nums">{formatInr(row.pendingNet)}</td>
                  <td className="px-3 py-2 tabular-nums">{formatInr(row.settledNet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
