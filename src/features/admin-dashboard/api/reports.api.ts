import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export type ReportRange = {
  from: string
  to: string
  format?: 'json' | 'csv' | 'pdf'
}

export type AdminReportSummary = {
  from: string
  to: string
  gmv: number
  customerPayments: number
  commissionEarned: number
  taxCollected: number
  tcsCollected: number
  shippingCollected: number
  discountAbsorbed: {
    platform: number
    vendor: number
    merchandiseTotal: number
  }
  vendorNetPayouts: number
}

export type VendorSettlementRow = {
  vendorId: string
  vendorName: string
  grossSales: number
  discountsAbsorbed: number
  commissionCharged: number
  tcsCharged: number
  netPaidOut: number
  pendingNet: number
  settledNet: number
}

export type ReconciliationReport = {
  from: string
  to: string
  customerPayments: number
  vendorNetPayouts: number
  platformCommission: number
  taxCollected: number
  tcsCollected: number
  shippingCollected: number
  accountedTotal: number
  difference: number
  balanced: boolean
  status: 'BALANCED' | 'MISMATCH'
  error: string | null
}

export type WalletLiabilityRow = {
  userId: string
  balance: number
  asOf: string
}

export type WalletLiabilityReport = {
  totalLiability: number
  customerCount: number
  rows: WalletLiabilityRow[]
}

export type CashbackWriteOffRow = {
  id: string
  userId: string
  originalClawbackAmount: number
  recoveredAmount: number
  writtenOffAmount: number
  bornBy: 'PLATFORM' | 'VENDOR'
  referenceType: string | null
  referenceId: string | null
  createdAt: string
}

export type CashbackWriteOffReport = {
  from: string
  to: string
  bornBy: 'PLATFORM' | 'VENDOR' | null
  recoveredTotal: number
  writtenOffTotal: number
  rows: CashbackWriteOffRow[]
}

export type WriteOffReportRange = ReportRange & {
  bornBy?: 'PLATFORM' | 'VENDOR'
}

export type VendorReportSummary = {
  from: string
  to: string
  vendorId: string
  sales: number
  commissionDeducted: number
  tcsDeducted: number
  discountAbsorbed: {
    ownCoupons: number
    platformCouponsOnMyItems: number
  }
  netPayout: number
  upcomingPayout: number
  historicalPayout: number
}

function withRange(path: string, range: ReportRange) {
  const q = new URLSearchParams({
    from: range.from,
    to: range.to,
    format: range.format ?? 'json',
  })
  return `${path}?${q.toString()}`
}

function withWriteOffRange(path: string, range: WriteOffReportRange) {
  const q = new URLSearchParams({
    from: range.from,
    to: range.to,
    format: range.format ?? 'json',
  })
  if (range.bornBy) q.set('bornBy', range.bornBy)
  return `${path}?${q.toString()}`
}

export const reportsApi = {
  adminSummary: (range: ReportRange) =>
    apiClient.get<AdminReportSummary>(withRange(API.reports.adminSummary, range)),
  adminVendors: (range: ReportRange) =>
    apiClient.get<{ from: string; to: string; vendors: VendorSettlementRow[] }>(
      withRange(API.reports.adminVendors, range),
    ),
  adminReconciliation: (range: ReportRange) =>
    apiClient.get<ReconciliationReport>(withRange(API.reports.adminReconciliation, range)),
  adminWalletLiability: (range: ReportRange) =>
    apiClient.get<WalletLiabilityReport>(withRange(API.reports.adminWalletLiability, range)),
  adminCashbackWriteOffs: (range: WriteOffReportRange) =>
    apiClient.get<CashbackWriteOffReport>(withWriteOffRange(API.reports.adminCashbackWriteOffs, range)),
  vendorSummary: (vendorId: string, range: ReportRange) =>
    apiClient.get<VendorReportSummary>(withRange(API.reports.vendor(vendorId), range)),
  exportUrl: (path: string, range: ReportRange) => withRange(path, range),
}
