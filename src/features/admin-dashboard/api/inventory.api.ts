import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export const inventoryApi = {
  lowStock: () => apiClient.get<unknown[]>(API.inventory.lowStock),
  updateStock: (variantId: string, stock: number) =>
    apiClient.patch<{ message: string }>(API.inventory.variantStock(variantId), { stock }),
}
