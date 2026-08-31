"use client";

import { useRef, useState } from "react";
import type { ProductListItem } from "@/shared/api/types";
import { MAX_COMPARED_PRODUCTS } from "@/features/products/constants/compare";

export function useCompareTray() {
  const [compareMode, setCompareMode] = useState(false);
  const [comparedProducts, setComparedProducts] = useState<ProductListItem[]>(
    [],
  );
  const compareSectionRef = useRef<HTMLElement>(null);

  const toggleCompareProduct = (product: ProductListItem) => {
    setComparedProducts((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id);
      }
      if (current.length >= MAX_COMPARED_PRODUCTS) return current;
      return [...current, product];
    });
  };

  return {
    compareMode,
    comparedProducts,
    compareAtLimit: comparedProducts.length >= MAX_COMPARED_PRODUCTS,
    compareMax: MAX_COMPARED_PRODUCTS,
    compareSectionRef,
    toggleCompareMode: () => setCompareMode((value) => !value),
    toggleCompareProduct,
    clearComparedProducts: () => setComparedProducts([]),
    scrollToCompare: () => {
      compareSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
  };
}
