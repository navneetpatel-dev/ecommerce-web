"use client";

import { useState, useMemo } from "react";
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
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
    }),
    [debouncedSearch, status],
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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  return {
    page,
    search,
    status,
    data,
    isLoading,
    setPage,
    handleSearchChange,
    handleStatusChange,
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
