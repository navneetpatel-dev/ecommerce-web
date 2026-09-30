"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CartItem } from "@/shared/api/types";
import { useCheckoutStore } from "../../store/checkout.store";
import { checkoutCartSignature } from "../../utils/checkout/checkoutSession.utils";

/**
 * Owns the checkout flow's lifetime: entering the page starts a fresh flow (Rule 3).
 *
 * The store is module state that outlives the route, so without this an earlier visit kept
 * its step, address, coupon mirror, payment method, wallet amount and gift options — the
 * reported bug was arriving at checkout on a previous flow's step. Nothing here is meant to
 * be resumed: the cart still holds the applied coupon, and the address is re-seeded from the
 * saved default, so a fresh flow is not an empty one.
 */
export function useCheckoutSession(items: CartItem[] | undefined) {
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);
  const syncCartSignature = useCheckoutStore((s) => s.syncCartSignature);
  const resetOnceRef = useRef(false);
  const signature = checkoutCartSignature(items);

  useEffect(() => {
    // Only the first run of this effect (i.e. the mount) resets, so a basket that changes
    // *during* the visit still goes through `syncCartSignature`'s narrower rule — a line
    // removed in another tab must not throw away the step the customer is standing on.
    if (!resetOnceRef.current) {
      resetOnceRef.current = true;
      resetCheckout();
    }
    syncCartSignature(signature);
  }, [resetCheckout, syncCartSignature, signature]);
}

/**
 * Wraps the order-placed side effects so the flow ends with the order.
 *
 * Both successful placement branches call back here — cash/COD right away, Razorpay after
 * its signature is verified. The paths that deliberately *keep* state (a dismissed or
 * failed Razorpay window, retried through `useRestoreCancelledCheckout`) never reach it, so
 * a payment resumed without a page load still finds its address, methods and payment method.
 */
export function useResetCheckoutOnOrderPlaced(onOrderPlaced: () => void) {
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  return useCallback(() => {
    onOrderPlaced();
    resetCheckout();
  }, [onOrderPlaced, resetCheckout]);
}
