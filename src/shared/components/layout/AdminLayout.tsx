'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/shared/components/layout/Header'
import { SidebarNav } from '@/shared/components/layout/SidebarNav'
import { ShieldCheck, Package, Tags, Settings, BarChart3, Users } from 'lucide-react'

const navItems = [
  { href: '/admin/vendors', icon: Users, label: 'Vendors' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/coupons', icon: Tags, label: 'Coupons' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="flex">
        <SidebarNav
          items={navItems}
          currentPath={pathname}
          header={
            <div className="flex items-center gap-2 px-3 py-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <span className="font-display font-semibold text-brand">Admin</span>
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
