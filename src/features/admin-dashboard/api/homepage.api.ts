import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { PromoBanner } from '@/shared/api/types'
import type { PromoBannerLinkType, PromoBannerStatus } from '@/shared/constants/statuses'

export type CreatePromoBannerBody = {
  title: string
  imageUrl: string
  linkType: PromoBannerLinkType
  linkTargetId?: string | null
  linkUrl?: string | null
  startDate?: string | null
  endDate?: string | null
  status?: PromoBannerStatus
  priority?: number
}

export type UpdatePromoBannerBody = Partial<CreatePromoBannerBody>

export const homepageAdminApi = {
  listBanners: () => apiClient.get<PromoBanner[]>(API.homepage.adminBanners),
  createBanner: (body: CreatePromoBannerBody) =>
    apiClient.post<PromoBanner>(API.homepage.adminBanners, body),
  updateBanner: (id: string, body: UpdatePromoBannerBody) =>
    apiClient.patch<PromoBanner>(API.homepage.adminBanner(id), body),
  deleteBanner: (id: string) => apiClient.delete<void>(API.homepage.adminBanner(id)),
}
