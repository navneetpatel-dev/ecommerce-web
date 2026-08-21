"use client";

import { useRef, useState } from "react";
import { useFilters } from "./useFilters";
import { useProductList } from "../api/products.queries";
import type { ProductListItem } from "@/shared/api/types";

export const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price Low to High" },
  { value: "price_desc", label: "Price High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

export function useProductListing() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedProducts, setComparedProducts] = useState<ProductListItem[]>(
    [],
  );
  const compareSectionRef = useRef<HTMLElement>(null);
  const { filters, updateFilter, updateFilterDebounced, clearFilters } =
    useFilters();
  const { data, isFetching } = useProductList(filters);

  const toggleCompareProduct = (product: ProductListItem) => {
    setComparedProducts((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id);
      }
      if (current.length >= 4) return current;
      return [...current, product];
    });
  };

  const clearComparedProducts = () => setComparedProducts([]);

  const scrollToCompare = () => {
    compareSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const selectSort = (value: string) => {
    updateFilter("sort", value);
    setSortOpen(false);
  };

  return {
    filterOpen,
    sortOpen,
    compareMode,
    comparedProducts,
    comparedIds: comparedProducts.map((item) => item.id),
    compareSectionRef,
    filters,
    data,
    isFetching,
    openFilters: () => setFilterOpen(true),
    closeFilters: () => setFilterOpen(false),
    openSort: () => setSortOpen(true),
    closeSort: () => setSortOpen(false),
    toggleCompareMode: () => setCompareMode((value) => !value),
    toggleCompareProduct,
    clearComparedProducts,
    scrollToCompare,
    updateFilter,
    updateFilterDebounced,
    clearFilters,
    selectSort,
  };
}
