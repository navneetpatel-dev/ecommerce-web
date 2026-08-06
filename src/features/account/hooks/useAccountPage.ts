'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/auth.store'
import {
  ACCOUNT_SECTIONS,
  DEFAULT_ACCOUNT_SECTION,
  isAccountSectionId,
} from '../constants'
import type { AccountSectionId } from '../types'

export function useAccountPage() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const currentUser = useAuthStore((s) => s.currentUser)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const tabParam = searchParams.get('tab')
  const activeSection: AccountSectionId = isAccountSectionId(tabParam)
    ? tabParam
    : DEFAULT_ACCOUNT_SECTION

  const setSection = useCallback(
    (id: AccountSectionId) => {
      const params = new URLSearchParams(searchParams.toString())
      if (id === DEFAULT_ACCOUNT_SECTION) {
        params.delete('tab')
      } else {
        params.set('tab', id)
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const activeNav = useMemo(
    () => ACCOUNT_SECTIONS.find((s) => s.id === activeSection) ?? ACCOUNT_SECTIONS[0]!,
    [activeSection]
  )

  return {
    isAuthenticated: Boolean(accessToken),
    currentUser,
    sections: ACCOUNT_SECTIONS,
    activeSection,
    activeNav,
    setSection,
  }
}
