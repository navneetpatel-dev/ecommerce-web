"use client";

import { useMemo } from "react";
import { useCategories } from "../../api/browse/categories.queries";
import {
  getChildCategories,
  getRootCategories,
} from "../../utils/browse/categoryHelpers";
import type { Category } from "@/shared/api/types";

export function useCategoriesPage() {
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data ?? [];
  const settled = categoriesQuery.isSuccess || categoriesQuery.isError;

  const roots = useMemo(() => getRootCategories(categories), [categories]);

  const rootsWithChildren = useMemo(
    () =>
      roots
        .map((root) => ({
          root,
          children: root.children?.length
            ? [...root.children].sort(
                (a, b) =>
                  (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
                  a.name.localeCompare(b.name),
              )
            : getChildCategories(categories, root.id),
        }))
        .filter((entry) => entry.children.length > 0),
    [categories, roots],
  );

  return {
    isLoading: !settled,
    categories,
    roots,
    rootsWithChildren,
    isEmpty: categoriesQuery.isSuccess && roots.length === 0,
  };
}

export type CategoryRootWithChildren = {
  root: Category;
  children: Category[];
};
