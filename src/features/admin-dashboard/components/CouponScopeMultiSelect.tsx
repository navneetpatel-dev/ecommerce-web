"use client";

import { useCallback } from "react";
import {
  InfiniteMultiSelect,
  type InfiniteMultiSelectPageQuery,
  type InfiniteMultiSelectPageResult,
} from "@/shared/components/InfiniteMultiSelect";
import { LABELS } from "@/shared/constants/labels";
import {
  CATEGORY_STATUS,
  PRODUCT_STATUS,
  VENDOR_STATUS,
} from "@/shared/constants/statuses";
import { categoriesApi } from "@/features/categories";
import { productsApi } from "@/features/products";
import { adminApi } from "../api/admin.api";

type ScopeKind = "vendor" | "product" | "category";

interface CouponScopeMultiSelectProps {
  scopeType: ScopeKind;
  value: string[];
  onChange: (ids: string[]) => void;
  /** When set, product options are limited to this vendor. */
  vendorId?: string | null;
  error?: boolean;
}

function scopeSearchPlaceholder(scopeType: ScopeKind) {
  if (scopeType === "category") return LABELS.searchCategories;
  if (scopeType === "product") return LABELS.searchProducts;
  return LABELS.searchVendors;
}

function emptyScopeMessage(scopeType: ScopeKind) {
  if (scopeType === "category") return LABELS.noCategoriesFound;
  if (scopeType === "product") return LABELS.noProductsFound;
  return LABELS.noVendorsFound;
}

export function CouponScopeMultiSelect({
  scopeType,
  value,
  onChange,
  vendorId = null,
  error = false,
}: CouponScopeMultiSelectProps) {
  const fetchPage = useCallback(
    async (
      query: InfiniteMultiSelectPageQuery,
    ): Promise<InfiniteMultiSelectPageResult> => {
      if (scopeType === "category") {
        const result = await categoriesApi.listPaginated({
          page: query.page,
          limit: query.limit,
          search: query.search,
          status: CATEGORY_STATUS.ACTIVE,
        });
        return {
          items: result.items.map((category) => ({
            id: category.id,
            label: category.parent?.name
              ? `${category.parent.name} / ${category.name}`
              : category.name,
          })),
          page: result.page,
          totalPages: result.totalPages,
          total: result.total,
        };
      }

      if (scopeType === "product") {
        const result = await productsApi.list({
          page: query.page,
          limit: query.limit,
          status: PRODUCT_STATUS.LIVE,
          search: query.search,
          vendorId: vendorId || undefined,
        });
        return {
          items: result.items.map((product) => ({
            id: product.id,
            label: product.name,
          })),
          page: result.page,
          totalPages: result.totalPages,
          total: result.total,
        };
      }

      const result = await adminApi.vendors({
        page: query.page,
        limit: query.limit,
        status: VENDOR_STATUS.APPROVED,
        search: query.search,
      });
      return {
        items: result.items.map((vendor) => ({
          id: vendor.id,
          label: vendor.businessName,
        })),
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      };
    },
    [scopeType, vendorId],
  );

  return (
    <InfiniteMultiSelect
      value={value}
      onChange={onChange}
      fetchPage={fetchPage}
      resetKey={`${scopeType}:${vendorId ?? ""}`}
      searchPlaceholder={scopeSearchPlaceholder(scopeType)}
      emptyMessage={emptyScopeMessage(scopeType)}
      error={error}
      idPrefix={`coupon-scope-${scopeType}`}
    />
  );
}
