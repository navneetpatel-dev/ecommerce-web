"use client";

import { useMemo } from "react";
import { useWishlist, useRemoveFromWishlist } from "../../api/wishlist/wishlist.queries";
import { useClientPagination } from "@/shared/hooks/pagination/useClientPagination.hook";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ProductListItem, WishlistItem } from "@/shared/api/types";

export interface WishlistPageItem {
  wishlistItem: WishlistItem;
  product: ProductListItem;
  isAvailable: boolean;
}

export function useWishlistPage() {
  const { data, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const items = useMemo<WishlistPageItem[]>(() => {
    if (!data?.items?.length) return [];
    return data.items.flatMap((item) => {
      const product = item.product;
      if (!product?.id) return [];
      const variants = product.variants ?? [];
      const stockFromVariants = variants.reduce(
        (sum, variant) => sum + Number(variant.stock ?? 0),
        0,
      );
      const hydratedProduct: ProductListItem = {
        ...product,
        stock: Number(product.stock ?? stockFromVariants),
        variants,
        isWishlisted: true,
      };
      return [
        {
          wishlistItem: item,
          product: hydratedProduct,
          isAvailable: item.isAvailable !== false,
        },
      ];
    });
  }, [data]);

  const availableProducts = useMemo(
    () => items.filter((i) => i.isAvailable).map((i) => i.product),
    [items],
  );

  const pagination = useClientPagination(items);
  const removeError = removeFromWishlist.isError
    ? getApiErrorMessage(removeFromWishlist.error, LABELS.genericActionFailed)
    : null;

  return {
    isLoading,
    items: pagination.pageRows,
    availableProducts,
    isEmpty: !isLoading && items.length === 0,
    pagination,
    removePending: removeFromWishlist.isPending,
    removeError,
    removeItem: (productId: string) => removeFromWishlist.mutate(productId),
  };
}
