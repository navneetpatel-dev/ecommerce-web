'use client'

import { HeaderContainer } from '@/shared/containers/HeaderContainer'
import { SidebarNav } from '@/shared/components/layout/SidebarNav'
import { ShieldCheck } from 'lucide-react'
import { useAdminLayout } from '@/shared/hooks/useAdminLayout'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { adminPermissionsForPath } from '@/shared/constants/adminNav'
import { PATHS } from '@/shared/constants/paths'

export function AdminLayoutContainer({ children }: { children: React.ReactNode }) {
  const { pathname, navItems } = useAdminLayout()

  return (
    <div className="min-h-screen bg-paper">
      <HeaderContainer showStorefrontChrome={false} />
      <div className="flex min-w-0">
        <SidebarNav
          items={navItems}
          currentPath={pathname}
          header={
            <div className="flex items-center gap-2 px-3 py-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <span className="text-[1.125rem] font-semibold text-brand">Admin</span>
            </div>
          }
        />
        <main className="min-w-0 flex-1 overflow-x-hidden p-6 lg:p-8 bg-surface">
          {pathname === PATHS.admin.root || pathname === PATHS.admin.profile ? (
            children
          ) : (
            <RequirePermission permission={adminPermissionsForPath(pathname)}>
              {children}
            </RequirePermission>
          )}
        </main>
      </div>
    </div>
  )
}
