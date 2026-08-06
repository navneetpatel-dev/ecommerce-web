'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { authApi } from '@/features/auth/api/auth.api'
import { cartKeys } from '@/features/cart/api/cart.queries'
import { STORAGE_KEYS } from '@/shared/constants/storage'

export function useAuthBootstrap() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)
  const setAuthBootstrapped = useAuthStore((s) => s.setAuthBootstrapped)
  const queryClient = useQueryClient()

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION)

      // Guests: cart can load immediately with the session cookie.
      if (!token) {
        if (!cancelled) setAuthBootstrapped(true)
        return
      }

      if (sessionStr) {
        try {
          setSession(token, JSON.parse(sessionStr))
        } catch {
          setAccessToken(token)
        }
      } else {
        setAccessToken(token)
      }

      // Wait for me() (and any 401 → refresh → retry) before enabling cart.
      // Otherwise optional cart routes used to succeed as guest with an expired Bearer.
      try {
        const fresh = await authApi.me()
        if (cancelled) return
        const accessToken = useAuthStore.getState().accessToken ?? token
        setSession(accessToken, fresh)
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fresh))
      } catch {
        if (cancelled) return
        clearSession()
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.SESSION)
      } finally {
        if (!cancelled) {
          setAuthBootstrapped(true)
          void queryClient.invalidateQueries({ queryKey: cartKeys.all })
        }
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [setAccessToken, setSession, clearSession, setAuthBootstrapped, queryClient])
}
