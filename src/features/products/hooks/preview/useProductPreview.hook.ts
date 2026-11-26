"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../../api/listing/products.api";
import { useProductDetailPreviewProps } from "./useProductDetailPreviewProps.hook";

/**
 * The customer's product page for a product the team can see (live or not): the product is loaded
 * with the team's own access, then shown exactly as the storefront shows it. Nothing here can add to
 * a cart.
 */
export function useProductPreview(productId: string, open: boolean) {
  const query = useQuery({
    queryKey: ["products", "preview", productId],
    queryFn: () => productsApi.detail(productId),
    enabled: open && Boolean(productId),
    // A preview should show what was just saved.
    staleTime: 0,
  });

  return {
    product: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
    detailProps: useProductDetailPreviewProps(query.data),
  };
}
