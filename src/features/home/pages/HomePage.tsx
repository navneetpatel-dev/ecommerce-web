'use client'
import { useCategories } from '../api/home.queries'
import { HeroSection } from '../components/HeroSection'
import { CategoryRail } from '../components/CategoryRail'
import { TrendingSection } from '../components/TrendingSection'

export function HomePage() {
  const { data: categories } = useCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      <HeroSection />
      {categories && <CategoryRail categories={categories} />}
      <TrendingSection />
    </div>
  )
}
