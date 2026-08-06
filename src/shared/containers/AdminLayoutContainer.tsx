'use client'

import { useEffect, useState } from 'react'
import { HeaderContainer } from '@/shared/containers/HeaderContainer'
import { SidebarNav } from '@/shared/components/layout/SidebarNav'
import { WorkspaceNavDrawer } from '@/shared/components/layout/WorkspaceNavDrawer'
import { ShieldCheck } from 'lucide-react'
import { useAdminLayout } from '@/shared/hooks/useAdminLayout'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { adminPermissionsForPath } from '@/shared/constants/adminNav'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'

export function AdminLayoutContainer({ children }: { children: React.ReactNode }) {
  const { pathname, navItems } = useAdminLayout()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  const sidebarHeader = (
    <div className="mb-4 flex items-center gap-2 px-3 py-2">
      <ShieldCheck className="h-5 w-5 text-brand" />
      <span className="text-[1.125rem] font-semibold text-brand">{LABELS.adminPanel}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-paper">
      <HeaderContainer
        showStorefrontChrome={false}
        showWorkspaceMenu
        onOpenWorkspaceNav={() => setNavOpen(true)}
      />
      <div className="flex min-w-0">
        <SidebarNav items={navItems} currentPath={pathname} header={sidebarHeader} />
        <WorkspaceNavDrawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          items={navItems}
          currentPath={pathname}
          title={LABELS.adminPanel}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden bg-surface p-4 sm:p-6 lg:p-8">
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
