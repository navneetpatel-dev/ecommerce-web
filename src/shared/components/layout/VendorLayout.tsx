'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/shared/components/layout/Header'
import { SidebarNav } from '@/shared/components/layout/SidebarNav'
import { BarChart3, Package, Truck, Wallet } from 'lucide-react'

const navItems = [
  { href: '/vendor/dashboard/overview', icon: BarChart3, label: 'Overview' },
  { href: '/vendor/dashboard/products', icon: Package, label: 'Products' },
  { href: '/vendor/dashboard/orders', icon: Truck, label: 'Orders' },
  { href: '/vendor/dashboard/payouts', icon: Wallet, label: 'Payouts' },
]

export function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="flex">
        <SidebarNav items={navItems} currentPath={pathname} />
        <main className="flex-1 p-6 lg:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  )
}
