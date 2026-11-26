"use client";

import { useEffect, useState } from "react";
import { categoriesApi, type CategoryImpact } from "@/features/categories";

/** What archiving or deleting this category touches (loaded when the confirmation opens). */
export function useArchiveCategoryDescription(categoryId: string) {
  const [impact, setImpact] = useState<CategoryImpact | null>(null);

  useEffect(() => {
    let active = true;
    void categoriesApi
      .impact(categoryId)
      .then((result) => {
        if (active) setImpact(result);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [categoryId]);

  return { impact };
}
