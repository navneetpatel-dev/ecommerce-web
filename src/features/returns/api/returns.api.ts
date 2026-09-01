import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { ReturnRequest } from '@/shared/api/types'
import { CLIENT_API_BASE_URL } from '@/shared/config/appConfig'
import { BEARER_PREFIX } from '@/shared/constants/http'
import { API_TIMEOUT_MS } from '@/shared/constants/timing'
import { useAuthStore } from '@/shared/stores/auth.store'
import { resolveDownloadFilename } from '@/shared/utils/downloadFilename'

export type CreateReturnBody = {
  orderItemId: string
  reasonCode: ReturnRequest['reasonCode']
  reason: string
  photoUrls?: string[]
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

export const returnsApi = {
  list: () => apiClient.get<ReturnRequest[]>(API.returns.list),
  listAdmin: async (params: PaginationQuery = {}): Promise<PaginatedList<ReturnRequest>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<ReturnRequest[]>(
      qs ? `${API.returns.admin}?${qs}` : API.returns.admin,
    )
    return unwrapPaginatedList(res)
  },
  create: (body: CreateReturnBody) => apiClient.post<ReturnRequest>(API.returns.create, body),
  get: (id: string) => apiClient.get<ReturnRequest>(API.returns.detail(id)),
  transition: (id: string, status: ReturnRequest['status']) =>
    apiClient.patch<{ message: string }>(API.returns.transition(id), { status }),
  delete: (id: string) => apiClient.delete(API.returns.delete(id)),
  downloadCreditNote: (id: string) =>
    downloadPdf(API.returns.creditNote(id), `credit-note_${id.slice(0, 8)}.pdf`),
  downloadDebitNote: (id: string) =>
    downloadPdf(API.returns.debitNote(id), `debit-note_${id.slice(0, 8)}.pdf`),
  retryRefund: (id: string) =>
    apiClient.post<ReturnRequest>(API.returns.retryRefund(id)),
}
