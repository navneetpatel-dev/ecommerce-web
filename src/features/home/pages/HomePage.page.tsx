"use client";

import { useMemo } from "react";
import { useHomePage } from "../hooks/useHomePage.hook";
import { HeroSection } from "../components/HeroSection.component";
import { CategoryRail } from "../components/CategoryRail.component";
import { TrendingSection } from "../components/TrendingSection.component";
import { VendorSpotlightSection } from "../components/VendorSpotlightSection.component";
import { RecentlyViewedSection } from "@/features/products";
import type { HeroSlide } from "../components/HeroSection.component";
import { promoBannerToHeroSlide } from "../utils/promoBanner";
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
