'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useVendorHomeRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/vendor/dashboard/overview')
  }, [router])
}
