'use client'

import { useCategories } from '../api/home.queries'
import { useTrendingProducts } from './useTrendingProducts'
import { useVendorSpotlight } from './useVendorSpotlight'
import { useRecentlyViewed } from './useRecentlyViewed'

export function useHomePage() {
  const { data: categories } = useCategories()
  const trending = useTrendingProducts()
  const spotlight = useVendorSpotlight()
  const recentlyViewed = useRecentlyViewed()

  return {
    categories,
    trendingProducts: trending.products,
    trendingLoading: trending.isLoading,
    spotlightVendors: spotlight.vendors,
    recentlyViewedProducts: recentlyViewed.products,
  }
}
