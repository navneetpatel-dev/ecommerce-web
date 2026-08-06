'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminLayout } from '@/shared/hooks/useAdminLayout'
import { PATHS } from '@/shared/constants/paths'

export function useAdminHomeRedirect() {
  const router = useRouter()
  const { navItems } = useAdminLayout()
  useEffect(() => {
    router.replace(navItems[0]?.href ?? PATHS.admin.analytics)
  }, [navItems, router])
}
