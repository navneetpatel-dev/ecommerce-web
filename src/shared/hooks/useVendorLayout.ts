'use client'

import { usePathname } from 'next/navigation'
import { BarChart3, Package, Truck, Wallet, MessageSquare } from 'lucide-react'
import { usePermissions } from './usePermissions'
import { VENDOR_NAV } from '@/shared/constants/vendorNav'

const VENDOR_NAV_ICONS = {
  '/vendor/dashboard/overview': BarChart3,
  '/vendor/dashboard/products': Package,
  '/vendor/dashboard/orders': Truck,
  '/vendor/dashboard/payouts': Wallet,
  '/vendor/dashboard/reviews': MessageSquare,
} as const

export function useVendorLayout() {
  const pathname = usePathname()
  const { hasAnyPermission } = usePermissions()
  const navItems = VENDOR_NAV.filter((item) => hasAnyPermission(...item.permissions)).map((item) => ({
    href: item.href,
    label: item.label,
    icon: VENDOR_NAV_ICONS[item.href],
    permissions: item.permissions,
  }))
  return { pathname, navItems }
}
