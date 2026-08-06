'use client'

import { useAuthStore } from '@/features/auth/store/auth.store'
import type { PermissionKey } from '@/shared/constants/permissions'

export function usePermissions() {
  const user = useAuthStore((state) => state.currentUser)
  const hasPermission = (key: PermissionKey | string) =>
    user?.role === 'SUPER_ADMIN' || Boolean(user?.permissions?.includes(key))
  const hasAnyPermission = (...keys: Array<PermissionKey | string>) => keys.some(hasPermission)

  return { hasPermission, hasAnyPermission }
}
