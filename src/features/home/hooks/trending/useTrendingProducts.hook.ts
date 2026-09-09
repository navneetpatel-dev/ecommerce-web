"use client";

import { useProductList } from "@/features/products";

export function useTrendingProducts() {
  const { data, isLoading } = useProductList({ sort: "trending", limit: 12 });

  return {
    products: data?.items,
    isLoading,
  };
}
