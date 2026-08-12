'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuthBootstrap } from '@/shared/hooks/useAuthBootstrap'
import { LoginRequiredDialogContainer } from '@/shared/containers/LoginRequiredDialogContainer'
import { RouteScrollResetContainer } from '@/shared/containers/RouteScrollResetContainer'
import { BrowseUrlTrackerContainer } from '@/shared/containers/BrowseUrlTrackerContainer'
import { RoleSurfaceGuard } from '@/shared/components/RoleSurfaceGuard'

function AuthBootstrap() {
  useAuthBootstrap()
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <RouteScrollResetContainer />
      <BrowseUrlTrackerContainer />
      <LoginRequiredDialogContainer />
      <RoleSurfaceGuard>{children}</RoleSurfaceGuard>
    </QueryClientProvider>
  )
}
