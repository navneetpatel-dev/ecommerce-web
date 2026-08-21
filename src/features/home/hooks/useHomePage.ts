"use client";

import { useCategories } from "@/features/categories";
import { useBanners } from "../api/home.queries";
import { useTrendingProducts } from "./useTrendingProducts";
import { useVendorSpotlight } from "./useVendorSpotlight";
import { useRecentlyViewed } from "@/features/products";

export function useHomePage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: banners } = useBanners();
  const trending = useTrendingProducts();
  const spotlight = useVendorSpotlight();
  const recentlyViewed = useRecentlyViewed();

  return {
    categories,
    categoriesLoading,
    banners: banners ?? null,
    trendingProducts: trending.products,
    trendingLoading: trending.isLoading,
    spotlightVendors: spotlight.vendors,
    spotlightLoading: spotlight.isLoading,
    recentlyViewedProducts: recentlyViewed.products,
  };
}
