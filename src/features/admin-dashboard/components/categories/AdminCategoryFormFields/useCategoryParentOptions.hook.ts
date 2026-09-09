"use client";

import { useEffect, useMemo, useState } from "react";
import { categoriesApi } from "@/features/categories";
import { CATEGORY_STATUS } from "@/shared/constants/statuses";
import { MAX_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import type { Category } from "@/shared/api/types";

export function useCategoryParentOptions(excludeCategoryId?: string) {
  const [parents, setParents] = useState<Category[]>([]);

  useEffect(() => {
    void categoriesApi
      .listPaginated({ page: 1, limit: MAX_PAGE_LIMIT })
      .then((result) => setParents(result.items));
  }, []);

  const parentOptions = useMemo(() => {
    const byId = new Map(parents.map((category) => [category.id, category]));
    const depthOf = (category: Category): number => {
      let depth = 0;
      let cursor: Category | undefined = category;
      const seen = new Set<string>();
      while (cursor?.parentId) {
        if (seen.has(cursor.id)) break;
        seen.add(cursor.id);
        depth += 1;
        cursor = byId.get(cursor.parentId);
      }
      return depth;
    };
    // Max taxonomy depth is 3 — only depth 0–1 nodes may be parents.
    return parents.filter(
      (category) =>
        category.status !== CATEGORY_STATUS.ARCHIVED &&
        category.id !== excludeCategoryId &&
        depthOf(category) < 2,
    );
  }, [parents, excludeCategoryId]);

  return parentOptions;
}

export const NONE_PARENT = "__none__";
