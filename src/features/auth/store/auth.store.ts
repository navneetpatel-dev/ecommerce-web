import { create } from 'zustand'
import { PATHS } from '@/shared/constants/paths'
import { ROLES } from '@/shared/constants/labels'
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
    case ROLES.SUPER_ADMIN:
    case ROLES.ADMIN_ORDER_MANAGER:
    case ROLES.ADMIN_CATALOG_MANAGER:
      return PATHS.admin.root
    case ROLES.VENDOR_OWNER:
    case ROLES.VENDOR_STAFF:
      return PATHS.vendor.overview
    default:
      return PATHS.home
  }
}
