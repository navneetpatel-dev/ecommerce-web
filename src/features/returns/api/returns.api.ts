import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { ReturnRequest } from '@/shared/api/types'

export type CreateReturnBody = {
  orderItemId: string
  reasonCode: ReturnRequest['reasonCode']
  reason: string
}

export const returnsApi = {
  list: () => apiClient.get<ReturnRequest[]>(API.returns.list),
  listAdmin: () => apiClient.get<ReturnRequest[]>(API.returns.admin),
  create: (body: CreateReturnBody) => apiClient.post<ReturnRequest>(API.returns.create, body),
  transition: (id: string, status: ReturnRequest['status']) =>
    apiClient.patch<{ message: string }>(API.returns.transition(id), { status }),
}
