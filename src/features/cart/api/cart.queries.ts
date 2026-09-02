import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth.store";
import {
  patchExistingCartItemQuantity,
  patchRemoveCartItem,
} from "../utils/cartDisplay.utils";
import { cartApi } from "./cart.api";
import { useCartDrawerStore } from "../store/cart.store";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";

export const cartKeys = {
  all: ["cart"] as const,
  /** Separate cache buckets so a pre-auth empty guest cart cannot stick after login/hydrate. */
  forAuth: (accessToken: string | null) =>
    [...cartKeys.all, accessToken ? "user" : "guest"] as const,
};

export const cartMutationKeys = {
  all: ["cart-mutation"] as const,
  add: ["cart-mutation", "add"] as const,
  update: ["cart-mutation", "update"] as const,
  remove: ["cart-mutation", "remove"] as const,
  clear: ["cart-mutation", "clear"] as const,
};

type AddToCartVars = {
  variantId: string;
  quantity?: number;
  /** Opens the cart drawer after a successful add. Defaults to true. */
  openDrawer?: boolean;
};

function clearCartMutationError() {
  useCartDrawerStore.getState().setMutationError(null);
}

function showCartMutationError(error: unknown, fallback: string) {
  useCartDrawerStore
    .getState()
    .setMutationError(getApiErrorMessage(error, fallback));
}

function syncCartCache(
  queryClient: ReturnType<typeof useQueryClient>,
  cart: Cart | undefined,
) {
  if (!cart) {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
    return;
  }

  queryClient.setQueriesData<Cart>({ queryKey: cartKeys.all }, (previous) => {
    if (!previous?.items?.length) return cart;

    // Keep the on-screen item order; only refresh quantities/fields from the server.
    const nextById = new Map(cart.items.map((item) => [item.id, item]));
    const preserved = previous.items
      .map((item) => nextById.get(item.id))
      .filter((item): item is Cart["items"][number] => Boolean(item));
    const added = cart.items.filter(
      (item) => !previous.items.some((prev) => prev.id === item.id),
    );

    return { ...cart, items: [...preserved, ...added] };
  });
}

export function useCart() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);

  return useQuery({
    queryKey: cartKeys.forAuth(accessToken),
    queryFn: () => cartApi.get(),
    // Wait until localStorage auth is restored so refresh does not GET /cart as a new guest.
    enabled: authBootstrapped,
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: cartMutationKeys.add,
    onMutate: clearCartMutationError,
    mutationFn: ({ variantId, quantity = 1 }: AddToCartVars) =>
      cartApi.addItem(variantId, quantity),
    onSuccess: (cart, variables) => {
      clearCartMutationError();
      syncCartCache(queryClient, cart);
      if (variables.openDrawer !== false) {
        import("../store/cart.store").then((m) =>
          m.useCartDrawerStore.getState().open(),
        );
      }
    },
    onError: (error) => showCartMutationError(error, LABELS.couldNotAddToCart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: cartMutationKeys.update,
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      clearCartMutationError();
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previous = queryClient.getQueriesData<Cart>({
        queryKey: cartKeys.all,
      });
      queryClient.setQueriesData<Cart>({ queryKey: cartKeys.all }, (cart) => {
        if (!cart?.items.length) return cart;
        return patchExistingCartItemQuantity(cart, itemId, quantity);
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      showCartMutationError(_error, LABELS.couldNotUpdateCart);
    },
    onSuccess: (cart) => {
      clearCartMutationError();
      syncCartCache(queryClient, cart);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: cartMutationKeys.remove,
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onMutate: async (itemId) => {
      clearCartMutationError();
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previous = queryClient.getQueriesData<Cart>({
        queryKey: cartKeys.all,
      });
      queryClient.setQueriesData<Cart>({ queryKey: cartKeys.all }, (cart) => {
        if (!cart?.items.length) return cart;
        return patchRemoveCartItem(cart, itemId);
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      showCartMutationError(_error, LABELS.couldNotRemoveCartItem);
    },
    onSuccess: (cart) => {
      clearCartMutationError();
      syncCartCache(queryClient, cart);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: cartMutationKeys.clear,
    mutationFn: () => cartApi.clear(),
    onMutate: async () => {
      clearCartMutationError();
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previous = queryClient.getQueriesData<Cart>({
        queryKey: cartKeys.all,
      });
      queryClient.setQueriesData<Cart>({ queryKey: cartKeys.all }, (cart) =>
        cart
          ? {
              ...cart,
              items: [],
              merchandiseSubtotal: undefined,
              total: undefined,
              pricingPreview: undefined,
              appliedCoupon: null,
              appliedCoupons: [],
            }
          : cart,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      showCartMutationError(_error, LABELS.couldNotClearCart);
    },
    onSuccess: () => {
      clearCartMutationError();
      return queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
