'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }))

  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const sessionStr = localStorage.getItem('session')
    if (token && sessionStr) {
      try {
        const user = JSON.parse(sessionStr)
        setSession(token, user)
      } catch {
        // Invalid session data
      }
    } else if (token) {
      setAccessToken(token)
    }
  }, [setAccessToken, setSession])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
