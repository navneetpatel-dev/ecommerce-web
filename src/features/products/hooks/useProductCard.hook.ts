"use client";

import { useCart } from "@/features/cart";
import { usePrefetchProduct } from "../api/products.queries";
import { useWishlistToggle } from "./useWishlistToggle.hook";
import { useProductCardQuantity } from "./useProductCardQuantity/index";
import type { ProductListItem } from "@/shared/api/types";

export function useProductCard(product: ProductListItem) {
  const { data: cart } = useCart();
  const prefetch = usePrefetchProduct();
  const { isWishlisted, toggle } = useWishlistToggle(product.id);

  const hasDiscount = Boolean(product.discountPercent && product.discountPercent > 0);
  const discountPercent = product.discountPercent ?? 0;

  const defaultVariantId = product.variants?.[0]?.id;
  const cartItem =
    cart?.items.find(
      (item) =>
        item.variantId === defaultVariantId || item.product.id === product.id,
    ) ?? null;
  const serverQty = cartItem?.quantity ?? 0;

  const { cartQuantity, maxQuantity, setQuantity, isMutating } =
    useProductCardQuantity({
      product,
      defaultVariantId,
      cartItem,
      serverQty,
    });

  return {
    isWishlisted:
      typeof isWishlisted === "boolean"
        ? isWishlisted
        : Boolean(product.isWishlisted),
    isAddingToCart: isMutating,
    hasDiscount,
    discountPercent,
    cartQuantity,
    maxQuantity,
    prefetch: () => prefetch(product.slug || product.id),
    toggleWishlist: toggle,
    addToCart: () => setQuantity(Math.max(1, cartQuantity + 1)),
    setQuantity,
  };
}
