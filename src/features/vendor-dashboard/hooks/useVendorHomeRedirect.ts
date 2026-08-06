'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PATHS } from '@/shared/constants/paths'

export function useVendorHomeRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace(PATHS.vendor.overview)
  }, [router])
}
