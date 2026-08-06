'use client'

import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '@/features/admin-dashboard/api/settings.api'

export function usePublicSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: () => settingsApi.getPublic(),
    staleTime: 1000 * 60 * 5,
  })
}
