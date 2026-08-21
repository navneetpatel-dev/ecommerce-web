"use client";

import { useMemo } from "react";
import { useProductList } from "@/features/products";

export interface SpotlightVendor {
  id: string;
  businessName: string;
  slug: string;
  logoUrl: string | null;
  /** Highlight product image — used when the vendor has no logo. */
  coverImageUrl: string | null;
  avgRating: number;
  highlightProduct: string;
}

export function useVendorSpotlight() {
  const { data, isLoading } = useProductList({ sort: "rating", limit: 24 });

  const vendors = useMemo<SpotlightVendor[]>(() => {
    return Array.from(
      new Map(
        (data?.items ?? [])
          .filter((item) => item.vendor?.id)
          .map((item) => [
            item.vendor.id,
            {
              ...item.vendor,
              coverImageUrl: item.imageUrl || null,
              avgRating: item.avgRating,
              highlightProduct: item.name,
            },
          ]),
      ).values(),
    ).slice(0, 4);
  }, [data]);

  return { vendors, isLoading };
}
