"use client";

import { useCallback, useEffect } from "react";
import type { CartItem } from "@/shared/api/types";
import { useCheckoutStore } from "../../store/checkout.store";
import { checkoutCartSignature } from "../../utils/checkout/checkoutSession.utils";

/**
 * Ties the stored flow to the basket being checked out (Rule 3: one concern per hook).
 *
 * The store outlives a purchase — it is module state, not per-page — so without this a
 * second purchase resumed the first one's step, address, coupon and payment. The signature
 * is the basket's line ids, so quantity edits keep the flow while a *different* basket
 * (what an order leaves behind once the customer starts again) resets it to step 1.
 */
export function useCheckoutSession(items: CartItem[] | undefined) {
  const syncCartSignature = useCheckoutStore((s) => s.syncCartSignature);
  const signature = checkoutCartSignature(items);

  useEffect(() => {
    syncCartSignature(signature);
  }, [signature, syncCartSignature]);
}

/**
 * Wraps the order-placed side effects so the flow ends with the order.
 *
 * Both successful placement branches call back here — cash/COD right away, Razorpay after
 * its signature is verified. The paths that deliberately *keep* state (a dismissed or
 * failed Razorpay window, retried through `useRestoreCancelledCheckout`) never reach it, so
 * a resumed payment still finds its address, methods and payment method.
 */
export function useResetCheckoutOnOrderPlaced(onOrderPlaced: () => void) {
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  return useCallback(() => {
    onOrderPlaced();
    resetCheckout();
  }, [onOrderPlaced, resetCheckout]);
}
