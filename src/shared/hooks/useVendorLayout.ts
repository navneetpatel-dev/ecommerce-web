'use client'

import { usePathname } from 'next/navigation'
import { BarChart3, Package, Truck, Wallet, MessageSquare } from 'lucide-react'
import { usePermissions } from './usePermissions'
import { VENDOR_NAV } from '@/shared/constants/vendorNav'
import { PATHS } from '@/shared/constants/paths'

const VENDOR_NAV_ICONS = {
  [PATHS.vendor.overview]: BarChart3,
  [PATHS.vendor.products]: Package,
  [PATHS.vendor.orders]: Truck,
  [PATHS.vendor.payouts]: Wallet,
  [PATHS.vendor.reviews]: MessageSquare,
} as const

export function useVendorLayout() {
  const pathname = usePathname()
  const { hasAnyPermission } = usePermissions()
  const navItems = VENDOR_NAV.filter((item) => hasAnyPermission(...item.permissions)).map((item) => ({
    href: item.href,
    label: item.label,
    icon: VENDOR_NAV_ICONS[item.href as keyof typeof VENDOR_NAV_ICONS],
    permissions: item.permissions,
  }))
  return { pathname, navItems }
}
