import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import { BEARER_PREFIX } from '@/shared/constants/http'
import { LABELS } from '@/shared/constants/labels'
import { useAuthStore } from '@/features/auth/store/auth.store'

export type ReportColumnMeta = {
  key: string
  labelKey: string
  format?: string
}

export type ReportCatalogItem = {
  type: string
  labelKey: string
  audience: string
  financial: boolean
  vendorScoped: boolean
  columns: ReportColumnMeta[]
}

export type ReportRunResult = {
  reportType: string
  columns: ReportColumnMeta[]
  rows: Record<string, unknown>[]
  meta: Record<string, unknown> | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type ReportFiltersInput = {
  from: string
  to: string
  page?: number
  limit?: number
  vendorId?: string
  categoryId?: string
  status?: string
}

function buildQuery(filters: ReportFiltersInput & { format?: string }) {
  const params = new URLSearchParams()
  params.set('from', filters.from)
  params.set('to', filters.to)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.vendorId) params.set('vendorId', filters.vendorId)
  if (filters.categoryId) params.set('categoryId', filters.categoryId)
  if (filters.status) params.set('status', filters.status)
  if (filters.format) params.set('format', filters.format)
  return params.toString()
}

async function downloadBlob(path: string, fallbackName: string) {
  const token = useAuthStore.getState().accessToken
  const base = process.env.NEXT_PUBLIC_API_URL ?? ''
  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  })
  if (!res.ok) {
    throw new Error(LABELS.couldNotLoadReport)
  }
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const disposition = res.headers.get('content-disposition') ?? ''
  const match = /filename="([^"]+)"/.exec(disposition)
  a.href = url
  a.download = match?.[1] ?? fallbackName
  a.click()
  URL.revokeObjectURL(url)
  return null
}

export const reportsEngineApi = {
  catalog: () => apiClient.get<ReportCatalogItem[]>(API.reports.catalog),
  run: (type: string, filters: ReportFiltersInput) =>
    apiClient.get<ReportRunResult>(API.reports.run(type, buildQuery({ ...filters, format: 'json' }))),
  exportExcel: (type: string, filters: ReportFiltersInput) =>
    downloadBlob(API.reports.run(type, buildQuery({ ...filters, format: 'xlsx' })), `${type}.xlsx`),
  downloadExport: (id: string) => downloadBlob(API.reports.exportDownload(id), `export_${id}.xlsx`),
  exportStatus: (id: string) =>
    apiClient.get<{
      id: string
      reportType: string
      status: string
      rowCount: number
      fileUrl: string | null
      errorMessage: string | null
    }>(API.reports.exportStatus(id)),
  customerOrderHistoryExport: (filters: ReportFiltersInput) =>
    downloadBlob(
      API.reports.customerOrderHistory(buildQuery({ ...filters, format: 'xlsx' })),
      'order-history.xlsx',
    ),
  customerOrderInvoice: (orderId: string) =>
    downloadBlob(API.reports.customerOrderInvoice(orderId), `invoice_${orderId.slice(0, 8)}.pdf`),
}
