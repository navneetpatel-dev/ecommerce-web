import { apiClient } from '@/shared/api/client/client'
import { API } from '@/shared/constants/apiRoutes'

export type ReportRange = {
  from: string
  to: string
  format?: 'json' | 'xlsx' | 'csv' | 'pdf'
  page?: number
  limit?: number
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
  pendingNet: number
  settledNet: number
  payoutAmount: number
  payoutPending: number
  payoutPaid: number
  payoutStatus: string
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
  refundsToCustomer?: number
  walletRechargeInflow?: number
  walletPointsRedeemedAtCheckout?: number
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
  purchasedPoints?: number
  promotionalPoints?: number
}

export type WalletLiabilityReport = {
  totalLiability: number
  customerCount: number
  totalPointsLiability?: number
  purchasedPointsLiability?: number
  promotionalPointsLiability?: number
  rows: WalletLiabilityRow[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type WalletRechargeRow = {
  id: string
  userId: string
  amountInr: number
  pointsCredited: number
  status: string
  razorpayOrderId: string | null
  paidAt: string | null
  createdAt: string
}

export type WalletRechargeReport = {
  from: string
  to: string
  totalInrCollected: number
  successCount: number
  failedCount: number
  pointsIssued: number
  rows: WalletRechargeRow[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
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
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
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
  if (range.page) q.set('page', String(range.page))
  if (range.limit) q.set('limit', String(range.limit))
  return `${path}?${q.toString()}`
}

function withWriteOffRange(path: string, range: WriteOffReportRange) {
  const q = new URLSearchParams({
    from: range.from,
    to: range.to,
    format: range.format ?? 'json',
  })
  if (range.bornBy) q.set('bornBy', range.bornBy)
  if (range.page) q.set('page', String(range.page))
  if (range.limit) q.set('limit', String(range.limit))
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
  adminWalletRecharge: (range: ReportRange) =>
    apiClient.get<WalletRechargeReport>(withRange(API.reports.adminWalletRecharge, range)),
  adminCashbackWriteOffs: (range: WriteOffReportRange) =>
    apiClient.get<CashbackWriteOffReport>(withWriteOffRange(API.reports.adminCashbackWriteOffs, range)),
  vendorSummary: (vendorId: string, range: ReportRange) =>
    apiClient.get<VendorReportSummary>(withRange(API.reports.vendor(vendorId), range)),
  exportUrl: (path: string, range: ReportRange) => withRange(path, range),
}
