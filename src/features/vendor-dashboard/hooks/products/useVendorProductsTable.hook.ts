"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useVendorProducts,
  vendorKeys,
} from "../../api/overview/vendor.queries";
import { productsApi } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";

export function useVendorProductsTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const [userFilters, setUserFilters] = useState<
    Partial<Record<string, string>>
  >({});
  const get = (k: string, alt?: string) =>
    userFilters[k] ??
    searchParams.get(k) ??
    (alt ? searchParams.get(alt) : null) ??
    "";

  const search = get("search", "q");
  const status = get("status");
  const categoryId = get("categoryId");
  const inStock = get("inStock");
  const minPrice = get("minPrice");
  const maxPrice = get("maxPrice");
  const sort = get("sort");

  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
      categoryId: categoryId || undefined,
      inStock: inStock === "true" || inStock === "in_stock" ? true : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort || undefined,
    }),
    [debouncedSearch, status, categoryId, inStock, minPrice, maxPrice, sort],
  );

  const { data, isLoading } = useVendorProducts(page, filters);

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.products.all });
      setDeleteTarget(null);
    },
  });

  const submitProduct = useMutation({
    mutationFn: (id: string) => productsApi.submitForApproval(id),
    onSuccess: () => {
      setActionMessage(LABELS.productSubmittedForApproval);
      queryClient.invalidateQueries({ queryKey: vendorKeys.products.all });
    },
    onError: (err) => {
      setActionMessage(getApiErrorMessage(err, LABELS.couldNotSubmitProduct));
    },
  });

  const handleFilterChange = (key: string) => (value: string) => {
    setUserFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClear = () => {
    setUserFilters({
      search: "",
      status: "",
      categoryId: "",
      inStock: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
    setPage(1);
  };

  return {
    page,
    search,
    status,
    categoryId,
    inStock,
    minPrice,
    maxPrice,
    sort,
    data,
    isLoading,
    setPage,
    handleSearchChange: handleFilterChange("search"),
    handleStatusChange: handleFilterChange("status"),
    handleCategoryChange: handleFilterChange("categoryId"),
    handleInStockChange: handleFilterChange("inStock"),
    handleMinPriceChange: handleFilterChange("minPrice"),
    handleMaxPriceChange: handleFilterChange("maxPrice"),
    handleSortChange: handleFilterChange("sort"),
    handleClear,
    deleteTarget,
    setDeleteTarget,
    confirmDelete: () => {
      if (!deleteTarget) return;
      deleteProduct.mutate(deleteTarget.id);
    },
    isDeleting: deleteProduct.isPending,
    submitForApproval: (id: string) => {
      setActionMessage(null);
      submitProduct.mutate(id);
    },
    isSubmitting: submitProduct.isPending,
    actionMessage,
  };
}
