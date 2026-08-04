import { apiClient } from '@/shared/api/client'

export const inventoryApi = {
  lowStock: () => apiClient.get<unknown[]>('/api/inventory/low-stock'),
  updateStock: (variantId: string, stock: number) =>
    apiClient.patch<{ message: string }>(`/api/inventory/variants/${variantId}/stock`, { stock }),
}
