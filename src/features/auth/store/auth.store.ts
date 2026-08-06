import { create } from 'zustand'
import { PATHS } from '@/shared/constants/paths'
import { ADMIN_ROLES, ROLES, VENDOR_ROLES, type RoleName } from '@/shared/constants/labels'
import type { CurrentUser } from '@/shared/api/types'

interface AuthState {
  accessToken: string | null
  currentUser: CurrentUser | null
  /** False until localStorage session is restored (or confirmed absent). Prevents cart race on refresh. */
  authBootstrapped: boolean
  setSession: (token: string, user: CurrentUser) => void
  setAccessToken: (token: string) => void
  clearSession: () => void
  setAuthBootstrapped: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  currentUser: null,
  authBootstrapped: false,
  setSession: (accessToken, currentUser) => set({ accessToken, currentUser }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearSession: () => set({ accessToken: null, currentUser: null }),
  setAuthBootstrapped: (authBootstrapped) => set({ authBootstrapped }),
}))

export function defaultRouteForRole(role: RoleName): string {
  if ((ADMIN_ROLES as readonly string[]).includes(role)) {
    return PATHS.admin.root
  }
  if ((VENDOR_ROLES as readonly string[]).includes(role)) {
    return PATHS.vendor.overview
  }
  return PATHS.home
}

/** Honor ?redirect= only when it stays inside that role's app surface. */
export function postAuthPath(role: RoleName, redirect?: string | null): string {
  const fallback = defaultRouteForRole(role)
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return fallback
  }

  if ((ADMIN_ROLES as readonly string[]).includes(role)) {
    return redirect.startsWith(PATHS.admin.root) ? redirect : fallback
  }
  if ((VENDOR_ROLES as readonly string[]).includes(role)) {
    return redirect.startsWith('/vendor') ? redirect : fallback
  }
  // Customers stay on the storefront (not admin/vendor dashboards).
  if (redirect.startsWith(PATHS.admin.root) || redirect.startsWith('/vendor')) {
    return fallback
  }
  return redirect
}
