import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { CommissionLedgerEntry, PayoutEntry } from '@/shared/api/types'
import { CLIENT_API_BASE_URL } from '@/shared/config/appConfig'
import { BEARER_PREFIX } from '@/shared/constants/http'
import { API_TIMEOUT_MS } from '@/shared/constants/timing'
import { useAuthStore } from '@/shared/stores/auth.store'
import { resolveDownloadFilename } from '@/shared/utils/downloadFilename'

export type CommissionInvoiceEntry = {
  id: string
  number: string
  vendorId: string
  payoutId: string | null
  vendorName: string | null
  taxableAmount: number
  gstAmount: number
  totalAmount: number
  issuedAt: string
}

async function downloadPdf(path: string, fallbackName: string) {
  const token = useAuthStore.getState().accessToken
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: 'include',
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  })
  if (!res.ok) throw new Error('Download failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = resolveDownloadFilename(res, fallbackName)
  a.click()
  URL.revokeObjectURL(url)
}

export const commissionsApi = {
  list: async (params: PaginationQuery = {}): Promise<PaginatedList<CommissionLedgerEntry>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<CommissionLedgerEntry[]>(
      qs ? `${API.commissions.list}?${qs}` : API.commissions.list,
    )
    return unwrapPaginatedList(res)
  },
  vendorSummary: (vendorId: string) =>
    apiClient.get<{ total: number; pending: number; settled: number }>(API.commissions.vendor(vendorId)),
  listInvoices: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<CommissionInvoiceEntry>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<CommissionInvoiceEntry[]>(
      qs ? `${API.commissions.invoices}?${qs}` : API.commissions.invoices,
    )
    return unwrapPaginatedList(res)
  },
  downloadInvoice: (invoiceId: string) =>
    downloadPdf(
      API.commissions.invoicePdf(invoiceId),
      `commission-invoice_${invoiceId.slice(0, 8)}.pdf`,
    ),
}

export const payoutsApi = {
  list: async (params: PaginationQuery = {}): Promise<PaginatedList<PayoutEntry>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<PayoutEntry[]>(
      qs ? `${API.payouts.list}?${qs}` : API.payouts.list,
    )
    return unwrapPaginatedList(res)
  },
  process: () => apiClient.post<PayoutEntry[]>(API.payouts.process, {}),
}
