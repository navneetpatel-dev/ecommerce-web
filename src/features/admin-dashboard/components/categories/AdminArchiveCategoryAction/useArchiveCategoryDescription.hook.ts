"use client";

import { useEffect, useState } from "react";
import { categoriesApi } from "@/features/categories";

export function useArchiveCategoryDescription(categoryId: string) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void categoriesApi
      .productCount(categoryId)
      .then((result) => {
        if (active) setCount(result.productCount);
      })
      .catch(() => {
        if (active) setCount(0);
      });
    return () => {
      active = false;
    };
  }, [categoryId]);

  return { count };
}
