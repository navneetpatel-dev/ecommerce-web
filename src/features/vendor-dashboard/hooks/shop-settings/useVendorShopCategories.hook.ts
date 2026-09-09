"use client";

import { useEffect, useMemo, useState } from "react";
import { categoriesApi } from "@/features/categories";
import type { Category } from "@/shared/api/types";

export function useVendorShopCategories(
  categoryIds: string[],
  onCategoryIdsChange: (ids: string[]) => void,
) {
  const [categories, setCategories] = useState<Category[]>([]);
  const selectedSet = useMemo(() => new Set(categoryIds), [categoryIds]);

  useEffect(() => {
    void categoriesApi
      .list()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const toggleCategory = (id: string) => {
    const next = selectedSet.has(id)
      ? categoryIds.filter((value) => value !== id)
      : [...categoryIds, id];
    onCategoryIdsChange(next);
  };

  const canSave = categoryIds.length > 0;

  return { categories, selectedSet, toggleCategory, canSave };
}
