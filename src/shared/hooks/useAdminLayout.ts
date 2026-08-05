'use client'

import { usePathname } from 'next/navigation'
import { Package, Tags, Settings, BarChart3, Users } from 'lucide-react'

const adminNavItems = [
  { href: '/admin/vendors', icon: Users, label: 'Vendors' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/coupons', icon: Tags, label: 'Coupons' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function useAdminLayout() {
  const pathname = usePathname()
  return { pathname, navItems: adminNavItems }
}
