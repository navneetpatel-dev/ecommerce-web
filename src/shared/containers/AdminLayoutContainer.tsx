'use client'

import { HeaderContainer } from '@/shared/containers/HeaderContainer'
import { SidebarNav } from '@/shared/components/layout/SidebarNav'
import { ShieldCheck } from 'lucide-react'
import { useAdminLayout } from '@/shared/hooks/useAdminLayout'

export function AdminLayoutContainer({ children }: { children: React.ReactNode }) {
  const { pathname, navItems } = useAdminLayout()

  return (
    <div className="min-h-screen bg-paper">
      <HeaderContainer />
      <div className="flex">
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
        <main className="flex-1 p-6 lg:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  )
}
