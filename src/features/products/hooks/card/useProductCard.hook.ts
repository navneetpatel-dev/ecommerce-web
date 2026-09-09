"use client";

import { useCart } from "@/features/cart";
import { usePrefetchProduct } from "../../api/listing/products.queries";
import { useWishlistToggle } from "./useWishlistToggle.hook";
import { useProductCardQuantity } from "./useProductCardQuantity/index";
import type { ProductListItem } from "@/shared/api/types";

export function useProductCard(product: ProductListItem) {
  const { data: cart } = useCart();
  const prefetch = usePrefetchProduct();
  const { isWishlisted, toggle } = useWishlistToggle(product.id);

  const showMrp = product.showMrp === true;
  const discountPercent = product.discountPercent ?? 0;

  const defaultVariantId = product.variants?.[0]?.id;
  const cartItem =
    cart?.items.find(
      (item) =>
        item.variantId === defaultVariantId || item.product.id === product.id,
    ) ?? null;
  const serverQty = cartItem?.quantity ?? 0;
  const activeVariantId = cartItem?.variantId ?? defaultVariantId;

  const { cartQuantity, maxQuantity, setQuantity, isMutating } =
    useProductCardQuantity({
      product,
      variantId: activeVariantId,
      cartItem,
      serverQty,
    });

  return {
    isWishlisted:
      typeof isWishlisted === "boolean"
        ? isWishlisted
        : Boolean(product.isWishlisted),
    isAddingToCart: isMutating,
    showMrp,
    discountPercent,
    cartQuantity,
    maxQuantity,
    prefetch: () => prefetch(product.slug || product.id),
    toggleWishlist: toggle,
    addToCart: (variantId?: string) =>
      setQuantity(Math.max(1, cartQuantity + 1), variantId),
    setQuantity,
  };
}
