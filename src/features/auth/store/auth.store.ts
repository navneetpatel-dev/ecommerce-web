import { create } from 'zustand'
import type { CurrentUser, RoleName } from '@/shared/api/types'

interface AuthState {
  accessToken: string | null
  currentUser: CurrentUser | null
  setSession: (token: string, user: CurrentUser) => void
  setAccessToken: (token: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  currentUser: null,
  setSession: (accessToken, currentUser) => set({ accessToken, currentUser }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearSession: () => set({ accessToken: null, currentUser: null }),
}))

export function defaultRouteForRole(role: RoleName): string {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN_ORDER_MANAGER':
    case 'ADMIN_CATALOG_MANAGER':
      return '/admin'
    case 'VENDOR_OWNER':
    case 'VENDOR_STAFF':
      return '/vendor/dashboard/overview'
    default:
      return '/'
  }
}
