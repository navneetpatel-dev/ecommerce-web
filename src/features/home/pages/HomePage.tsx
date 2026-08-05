'use client'
import { useCategories } from '../api/home.queries'
import { HeroSection } from '../components/HeroSection'
import { CategoryRail } from '../components/CategoryRail'
import { TrendingSection } from '../components/TrendingSection'
import { VendorSpotlightSection } from '../components/VendorSpotlightSection'
import { RecentlyViewedSection } from '../components/RecentlyViewedSection'

export function HomePage() {
  const { data: categories } = useCategories()

  return (
    <div className="space-y-12 md:space-y-20">
      <HeroSection />
      <div className="max-w-[1600px] mx-auto px-4 space-y-12 md:space-y-20">
        {categories && <CategoryRail categories={categories} />}
        <TrendingSection />
        <VendorSpotlightSection />
        <RecentlyViewedSection />
      </div>
    </div>
  )
}
