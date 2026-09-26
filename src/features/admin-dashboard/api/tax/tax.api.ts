import { apiClient } from '@/shared/api/client/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/client/pagination'
import { API } from '@/shared/constants/apiRoutes'

/** A tax rule; the price band (both fields or neither) charges a higher GST above a per-piece value. */
export type TaxRuleInput = {
  gstPercentage: number
  hsnCode?: string
  categoryId?: string
  /** Per-piece value in ₹ above which `gstPercentageAbove` applies. */
  priceBandThreshold?: number | null
  gstPercentageAbove?: number | null
}

export const taxApi = {
  getRules: async (params: PaginationQuery = {}): Promise<PaginatedList<Record<string, unknown>>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<Record<string, unknown>[]>(
      qs ? `${API.tax.rules}?${qs}` : API.tax.rules,
    )
    return unwrapPaginatedList(res)
  },
  createRule: (body: TaxRuleInput) => apiClient.post<unknown>(API.tax.rules, body),
  updateRule: (id: string, body: unknown) => apiClient.patch<unknown>(API.tax.rule(id), body),
  deleteRule: (id: string) => apiClient.delete(API.tax.rule(id)),
}
