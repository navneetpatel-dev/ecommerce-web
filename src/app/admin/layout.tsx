'use client'

import { AdminLayout } from '@/shared/components/layout/AdminLayout'

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
