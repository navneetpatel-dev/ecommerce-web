'use client'

import { useMemo } from 'react'
import { useHomePage } from '../hooks/useHomePage'
import { HeroSection } from '../components/HeroSection'
import { CategoryRail } from '../components/CategoryRail'
import { TrendingSection } from '../components/TrendingSection'
import { VendorSpotlightSection } from '../components/VendorSpotlightSection'
import { RecentlyViewedSection } from '../components/RecentlyViewedSection'
import type { HeroSlide } from '../components/HeroSection'
import { promoBannerToHeroSlide } from '../utils/promoBanner'

export function HomePage() {
  const home = useHomePage()

  const heroSlides = useMemo<HeroSlide[] | undefined>(() => {
    if (!home.banners?.length) return undefined
    return home.banners.map(promoBannerToHeroSlide)
  }, [home.banners])

  return (
    <div className="space-y-12 md:space-y-20">
      <HeroSection slides={heroSlides} />
      <div className="storefront-container space-y-12 md:space-y-20">
        <CategoryRail categories={home.categories} isLoading={home.categoriesLoading} />
        <TrendingSection products={home.trendingProducts} isLoading={home.trendingLoading} />
        <VendorSpotlightSection vendors={home.spotlightVendors} isLoading={home.spotlightLoading} />
        <RecentlyViewedSection products={home.recentlyViewedProducts} />
      </div>
    </div>
  )
}
