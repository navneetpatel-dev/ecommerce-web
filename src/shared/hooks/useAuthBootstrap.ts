'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { authApi } from '@/features/auth/api/auth.api'

export function useAuthBootstrap() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const sessionStr = localStorage.getItem('session')
    if (token && sessionStr) {
      try {
        const user = JSON.parse(sessionStr)
        setSession(token, user)
        void authApi
          .me()
          .then((fresh) => {
            setSession(token, fresh)
            localStorage.setItem('session', JSON.stringify(fresh))
          })
          .catch(() => {
            clearSession()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('session')
          })
      } catch {
        // Invalid session data
      }
    } else if (token) {
      setAccessToken(token)
    }
  }, [setAccessToken, setSession, clearSession])
}
