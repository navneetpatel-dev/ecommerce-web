'use client'

import { usePathname } from 'next/navigation'
import {
  Package,
  Tags,
  Settings,
  BarChart3,
  Users,
  FolderTree,
  ShoppingBag,
  RotateCcw,
  MessageSquare,
  Percent,
  Truck,
  Wallet,
  ClipboardList,
} from 'lucide-react'
import { usePermissions } from './usePermissions'
import { ADMIN_NAV } from '@/shared/constants/adminNav'

const ADMIN_NAV_ICONS = {
  '/admin/vendors': Users,
  '/admin/products': Package,
  '/admin/categories': FolderTree,
  '/admin/orders': ShoppingBag,
  '/admin/returns': RotateCcw,
  '/admin/coupons': Tags,
  '/admin/reviews': MessageSquare,
  '/admin/tax': Percent,
  '/admin/shipping': Truck,
  '/admin/finance': Wallet,
  '/admin/users': Users,
  '/admin/analytics': BarChart3,
  '/admin/audit': ClipboardList,
  '/admin/settings': Settings,
} as const

export function useAdminLayout() {
  const pathname = usePathname()
  const { hasAnyPermission } = usePermissions()
  const navItems = ADMIN_NAV.filter((item) => hasAnyPermission(...item.permissions)).map((item) => ({
    href: item.href,
    label: item.label,
    icon: ADMIN_NAV_ICONS[item.href],
    permissions: item.permissions,
  }))
  return { pathname, navItems }
}
