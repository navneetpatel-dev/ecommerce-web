"use client";

import { useCallback } from "react";
import type {
  InfiniteSingleSelectPageQuery,
  InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import { createPageCache } from "@/shared/utils/infinite-single-select/pageCache";
import { productsApi } from "../../api/listing/products.api";
import {
  categoryFieldLabel,
  pickerItemToCategory,
} from "../../utils/product-editor/categoryGst";

const pageCache = createPageCache<InfiniteSingleSelectPageResult>();

/**
 * Pages of the category picker for the infinite select. Nothing is requested until the dropdown
 * opens (the select only calls this then); a page already fetched in the last minute is reused.
 */
export function useProductCategoryPicker() {
  return useCallback(
    async (
      query: InfiniteSingleSelectPageQuery,
    ): Promise<InfiniteSingleSelectPageResult> => {
      const key = `${query.search ?? ""}:${query.page}:${query.limit}`;
      const cached = pageCache.get(key);
      if (cached) return cached;
      const res = await productsApi.categoryPicker({
        page: query.page,
        limit: query.limit,
        search: query.search,
      });
      const result: InfiniteSingleSelectPageResult = {
        items: res.items.map((item) => {
          const category = pickerItemToCategory(item);
          return {
            id: category.id,
            label: categoryFieldLabel(category),
            data: category,
          };
        }),
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
      };
      pageCache.set(key, result);
      return result;
    },
    [],
  );
}
