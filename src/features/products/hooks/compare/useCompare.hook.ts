"use client";

import { useEffect } from "react";
import {
  MAX_COMPARED_PRODUCTS,
  MIN_COMPARED_PRODUCTS,
} from "../../constants/compare/compare";
import { useCompareStore } from "../../stores/compare/compare.store";

/**
 * Compare tray for any surface (PLP bar + /compare page). The store read is
 * deferred to an effect because sessionStorage is not available during SSR.
 */
export function useCompare() {
  const mode = useCompareStore((state) => state.mode);
  const products = useCompareStore((state) => state.products);
  const toggleMode = useCompareStore((state) => state.toggleMode);
  const toggle = useCompareStore((state) => state.toggle);
  const clear = useCompareStore((state) => state.clear);
  const hydrate = useCompareStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return {
    compareMode: mode,
    comparedProducts: products,
    comparedIds: products.map((item) => item.id),
    compareAtLimit: products.length >= MAX_COMPARED_PRODUCTS,
    canCompare: products.length >= MIN_COMPARED_PRODUCTS,
    toggleCompareMode: toggleMode,
    toggleCompareProduct: toggle,
    clearComparedProducts: clear,
    hydrate,
  };
}
