import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/features/cart";
import { ordersKeys } from "@/features/orders";
import { invalidateWalletQueries } from "@/features/wallet";
import { checkoutKeys, type CheckoutQuoteInput } from "../../api/checkout/checkout.queries";

/** Query-cache invalidation/refetch helpers around placing an order (Rule 3). */
export function useCheckoutCacheActions(quoteInput: CheckoutQuoteInput) {
  const queryClient = useQueryClient();

  const refetchCart = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: cartKeys.all });
  }, [queryClient]);

  const invalidateCheckoutQuote = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: checkoutKeys.quote(quoteInput),
    });
  }, [queryClient, quoteInput]);

  const clearCartCache = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [queryClient]);

  /**
   * Order placed — the cart is empty server-side, but this page is mid-navigation.
   * Refetching now would empty the mounted cart query and swap the whole checkout
   * for a skeleton for one frame. Mark it stale instead; the cart refetches the
   * next time it mounts. Orders are invalidated so the new order shows up in the
   * list and detail views.
   */
  const onOrderPlaced = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: cartKeys.all,
      refetchType: "none",
    });
    void queryClient.invalidateQueries({ queryKey: ordersKeys.all });
  }, [queryClient]);

  const invalidateWalletCache = useCallback(() => {
    invalidateWalletQueries(queryClient);
  }, [queryClient]);

  return {
    refetchCart,
    invalidateCheckoutQuote,
    clearCartCache,
    onOrderPlaced,
    invalidateWalletCache,
  };
}
