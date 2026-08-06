import { useQuery } from '@tanstack/react-query'
import { homeApi } from './home.api'

export const homeKeys = {
  banners: ['home', 'banners'] as const,
}

export function useBanners() {
  return useQuery({
    queryKey: homeKeys.banners,
    queryFn: () => homeApi.getBanners(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export { useCategories } from '@/features/categories/api/categories.queries'
