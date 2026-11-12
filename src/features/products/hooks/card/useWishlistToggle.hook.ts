import { useEffect } from "react";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
  rememberPendingWishlist,
  takePendingWishlist,
} from "@/features/wishlist";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";

export function useWishlistToggle(productId: string | undefined) {
  const { data: wishlist, isSuccess } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { requireAuth } = useRequireAuth();
  const signedIn = Boolean(useAuthStore((s) => s.accessToken));
  const { mutate: addMutate } = addToWishlist;

  // C-05: the heart tapped before signing in is saved once the shopper is back.
  useEffect(() => {
    if (!signedIn || !isSuccess || !productId) return;
    if (!takePendingWishlist(productId)) return;
    const alreadySaved = wishlist?.items?.some(
      (item) => item.productId === productId,
    );
    if (alreadySaved) return;
    addMutate(productId, {
      onSuccess: () => notifySuccess(LABELS.savedToWishlist),
    });
  }, [signedIn, isSuccess, productId, wishlist, addMutate]);

  // undefined while wishlist hasn't loaded yet — callers can fall back to product.isWishlisted
  const isWishlisted = !productId
    ? false
    : isSuccess
      ? Boolean(wishlist?.items?.some((item) => item.productId === productId))
      : undefined;

  const toggle = () => {
    if (!productId) return;
    if (
      !requireAuth({
        title: "Save to wishlist",
        message:
          "Sign in to save products to your wishlist and find them later.",
      })
    ) {
      rememberPendingWishlist(productId);
      return;
    }

    const currentlyWishlisted =
      typeof isWishlisted === "boolean"
        ? isWishlisted
        : Boolean(
            wishlist?.items?.some((item) => item.productId === productId),
          );

    if (currentlyWishlisted) {
      removeFromWishlist.mutate(productId);
    } else {
      addToWishlist.mutate(productId);
    }
  };

  return {
    isWishlisted,
    toggle,
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
}
