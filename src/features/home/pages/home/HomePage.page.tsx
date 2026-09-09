"use client";

import { useMemo } from "react";
import { useHomePage } from "../../hooks/page/useHomePage.hook";
import { HeroSection } from "../../components/hero/HeroSection.component";
import { CategoryRail } from "../../components/category-rail/CategoryRail.component";
import { TrendingSection } from "../../components/trending/TrendingSection.component";
import { VendorSpotlightSection } from "../../components/vendor-spotlight/VendorSpotlightSection.component";
import { RecentlyViewedSection } from "@/features/products";
import type { HeroSlide } from "../../components/hero/HeroSection.component";
import { promoBannerToHeroSlide } from "../../utils/promo-banners/promoBanner";
import { homePageStyles as styles } from "./homePage.styles";

export function HomePage() {
  const home = useHomePage();

  const heroSlides = useMemo<HeroSlide[] | undefined>(() => {
    if (!home.banners?.length) return undefined;
    return home.banners.map(promoBannerToHeroSlide);
  }, [home.banners]);

  return (
    <div className={styles.container}>
      <HeroSection slides={heroSlides} />
      <div className={styles.contentWrapper}>
        <CategoryRail
          categories={home.categories}
          isLoading={home.categoriesLoading}
        />
        <TrendingSection
          products={home.trendingProducts}
          isLoading={home.trendingLoading}
        />
        <VendorSpotlightSection
          vendors={home.spotlightVendors}
          isLoading={home.spotlightLoading}
        />
        <RecentlyViewedSection products={home.recentlyViewedProducts} />
      </div>
    </div>
  );
}
