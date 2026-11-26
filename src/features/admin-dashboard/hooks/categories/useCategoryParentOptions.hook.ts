"use client";

import { useEffect, useMemo, useState } from "react";
import { categoriesApi } from "@/features/categories";
import { CATEGORY_STATUS } from "@/shared/constants/statuses";
import { MAX_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import type { Category } from "@/shared/api/types";

/** The deepest a category may sit; its children would be one level deeper, so depth 0 and 1 can be parents. */
const MAX_PARENT_DEPTH = 1;

/**
 * Categories that can be a parent: active, not too deep, in tree order (the server leaves out the
 * edited category and everything below it, so a cycle cannot be picked). Every page is loaded, so
 * the list is not cut at the first 100.
 */
export function useCategoryParentOptions(excludeCategoryId?: string) {
  const [parents, setParents] = useState<Category[]>([]);

  useEffect(() => {
    let active = true;
    async function loadAll() {
      const all: Category[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const result = await categoriesApi.listPaginated({
          page,
          limit: MAX_PAGE_LIMIT,
          excludeId: excludeCategoryId,
        });
        all.push(...result.items);
        totalPages = result.totalPages;
        page += 1;
      } while (page <= totalPages);
      if (active) setParents(all);
    }
    void loadAll().catch(() => undefined);
    return () => {
      active = false;
    };
  }, [excludeCategoryId]);

  return useMemo(
    () =>
      parents.filter(
        (category) =>
          category.status !== CATEGORY_STATUS.ARCHIVED &&
          (category.depth ?? 0) <= MAX_PARENT_DEPTH,
      ),
    [parents],
  );
}

export const NONE_PARENT = "__none__";
