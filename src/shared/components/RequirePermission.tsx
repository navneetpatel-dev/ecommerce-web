'use client'

import { EmptyState } from '@/shared/components/EmptyState'
import { usePermissions } from '@/shared/hooks/usePermissions'
import type { PermissionKey } from '@/shared/constants/permissions'

export function RequirePermission({
  permission,
  children,
}: {
  permission: PermissionKey | PermissionKey[]
  children: React.ReactNode
}) {
  const { hasAnyPermission } = usePermissions()
  const allowed = hasAnyPermission(...(Array.isArray(permission) ? permission : [permission]))
  if (!allowed) {
    return (
      <EmptyState
        heading="You don't have access"
        message="Your role does not include permission for this page."
      />
    )
  }
  return <>{children}</>
}
