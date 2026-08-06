import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { PromoBanner } from '@/shared/api/types'

export const homeApi = {
  getBanners: () => apiClient.get<PromoBanner[]>(API.homepage.banners),
}
