'use client'

import { HeaderContainer } from '@/shared/containers/HeaderContainer'
import { SidebarNav } from '@/shared/components/layout/SidebarNav'
import { useVendorLayout } from '@/shared/hooks/useVendorLayout'

export function VendorLayoutContainer({ children }: { children: React.ReactNode }) {
  const { pathname, navItems } = useVendorLayout()

  return (
    <div className="min-h-screen bg-paper">
      <HeaderContainer showStorefrontChrome={false} />
      <div className="flex min-w-0">
        <SidebarNav items={navItems} currentPath={pathname} />
        <main className="min-w-0 flex-1 overflow-x-hidden p-6 lg:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  )
}
