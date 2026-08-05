import { apiClient } from '@/shared/api/client'
import type { Cart } from '@/shared/api/types'
import { ensureGuestSessionId } from '../utils/guest-session'

function withGuestSession<T>(fn: () => Promise<T>): Promise<T> {
  ensureGuestSessionId()
  return fn()
}

export const cartApi = {
  get: () => withGuestSession(() => apiClient.get<Cart>('/api/cart')),
  addItem: (variantId: string, quantity = 1) =>
    withGuestSession(() => apiClient.post<Cart>('/api/cart/items', { variantId, quantity })),
  updateItem: (itemId: string, quantity: number) =>
    withGuestSession(() => apiClient.patch<Cart>(`/api/cart/items/${itemId}`, { quantity })),
  removeItem: (itemId: string) =>
    withGuestSession(() => apiClient.delete<Cart>(`/api/cart/items/${itemId}`)),
  clear: () => withGuestSession(() => apiClient.delete<Cart>('/api/cart')),
}
