import { apiClient } from '@/shared/api/client'
import type { ReturnRequest } from '@/shared/api/types'

export type CreateReturnBody = {
  orderItemId: string
  reasonCode: ReturnRequest['reasonCode']
  reason: string
}

export const returnsApi = {
  list: () => apiClient.get<ReturnRequest[]>('/api/returns'),
  create: (body: CreateReturnBody) => apiClient.post<ReturnRequest>('/api/returns', body),
}
