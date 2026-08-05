'use client'

import { useHomePage } from '../hooks/useHomePage'
import { HeroSection } from '../components/HeroSection'
import { CategoryRail } from '../components/CategoryRail'
import { TrendingSection } from '../components/TrendingSection'
import { VendorSpotlightSection } from '../components/VendorSpotlightSection'
import { RecentlyViewedSection } from '../components/RecentlyViewedSection'

export function HomePage() {
  const home = useHomePage()

  return (
    <div className="space-y-12 md:space-y-20">
      <HeroSection />
      <div className="max-w-[1600px] mx-auto px-4 space-y-12 md:space-y-20">
        <CategoryRail categories={home.categories} isLoading={home.categoriesLoading} />
        <TrendingSection products={home.trendingProducts} isLoading={home.trendingLoading} />
        <VendorSpotlightSection vendors={home.spotlightVendors} isLoading={home.spotlightLoading} />
        <RecentlyViewedSection products={home.recentlyViewedProducts} />
      </div>
    </div>
  )
}
