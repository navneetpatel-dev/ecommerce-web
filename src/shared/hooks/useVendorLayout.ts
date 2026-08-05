'use client'

import { usePathname } from 'next/navigation'
import { BarChart3, Package, Truck, Wallet } from 'lucide-react'

const vendorNavItems = [
  { href: '/vendor/dashboard/overview', icon: BarChart3, label: 'Overview' },
  { href: '/vendor/dashboard/products', icon: Package, label: 'Products' },
  { href: '/vendor/dashboard/orders', icon: Truck, label: 'Orders' },
  { href: '/vendor/dashboard/payouts', icon: Wallet, label: 'Payouts' },
]

export function useVendorLayout() {
  const pathname = usePathname()
  return { pathname, navItems: vendorNavItems }
}
