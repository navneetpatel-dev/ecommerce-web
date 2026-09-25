import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "./wishlist.api";
import { cartKeys, useCartDrawerStore } from "@/features/cart";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import type { WishlistItem } from "@/shared/api/types";

type WishlistData = { items: WishlistItem[] };

export const wishlistKeys = {
  all: ["wishlist"] as const,
};

export function useWishlist() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: () => wishlistApi.get(),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.add(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });
      const previous = queryClient.getQueryData<WishlistData>(wishlistKeys.all);
      queryClient.setQueryData<WishlistData>(wishlistKeys.all, (current) => {
        const items = current?.items ?? [];
        if (items.some((item) => item.productId === productId))
          return current ?? { items };
        return {
          items: [
            ...items,
            {
              id: `optimistic-${productId}`,
              productId,
              priceAtAdd: 0,
              priceDropAmount: null,
              isAvailable: true,
              unavailableReason: null,
              product: { id: productId } as WishlistItem["product"],
            },
          ],
        };
      });
      return { previous };
    },
    onError: (error, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(wishlistKeys.all, context.previous);
      }
      notifyError(getApiErrorMessage(error, LABELS.genericActionFailed));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });
      const previous = queryClient.getQueryData<WishlistData>(wishlistKeys.all);
      queryClient.setQueryData<WishlistData>(wishlistKeys.all, (current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.filter((item) => item.productId !== productId),
        };
      });
      return { previous };
    },
    onError: (error, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(wishlistKeys.all, context.previous);
      }
      notifyError(getApiErrorMessage(error, LABELS.genericActionFailed));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useMoveToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.moveToCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });
      const previous = queryClient.getQueryData<WishlistData>(wishlistKeys.all);
      queryClient.setQueryData<WishlistData>(wishlistKeys.all, (current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.filter((item) => item.productId !== productId),
        };
      });
      return { previous };
    },
    onError: (error, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(wishlistKeys.all, context.previous);
      }
      notifyError(getApiErrorMessage(error, LABELS.genericActionFailed));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKeys.all });
      useCartDrawerStore.getState().open();
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}
