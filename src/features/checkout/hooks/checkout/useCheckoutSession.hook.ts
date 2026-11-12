"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CartItem } from "@/shared/api/types";
import { useCheckoutStore } from "../../store/checkout.store";
import { checkoutCartSignature } from "../../utils/checkout/checkoutSession.utils";
import {
  clearStoredCheckoutFlow,
  pickCheckoutFlow,
  readStoredCheckoutFlow,
  writeStoredCheckoutFlow,
} from "../../utils/checkout/checkoutFlowStorage";

/**
 * Owns the checkout flow's lifetime: entering the page starts a fresh flow (Rule 3).
 *
 * The store is module state that outlives the route, so without this an earlier visit kept
 * its step, address, coupon mirror, payment method, wallet amount and gift options — the
 * reported bug was arriving at checkout on a previous flow's step.
 *
 * A reload is different (B-56): the flow is saved to sessionStorage while the page is
 * open and resumed on the next load. Leaving checkout clears it (the unmount cleanup runs
 * on in-app navigation but not on a reload), so only a reload resumes.
 */
export function useCheckoutSession(items: CartItem[] | undefined) {
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);
  const restoreCheckout = useCheckoutStore((s) => s.restoreCheckout);
  const syncCartSignature = useCheckoutStore((s) => s.syncCartSignature);
  const resetOnceRef = useRef(false);
  const signature = checkoutCartSignature(items);
  const cartLoaded = items !== undefined;

  useEffect(() => {
    // Only the first run of this effect (i.e. the mount) resets, so a basket that changes
    // *during* the visit still goes through `syncCartSignature`'s narrower rule — a line
    // removed in another tab must not throw away the step the customer is standing on.
    if (!resetOnceRef.current) {
      resetOnceRef.current = true;
      const saved = readStoredCheckoutFlow();
      if (saved) restoreCheckout(saved);
      else resetCheckout();
    }
    // Before the cart has loaded there is no basket to compare a resumed flow against.
    if (cartLoaded) syncCartSignature(signature);
  }, [
    resetCheckout,
    restoreCheckout,
    syncCartSignature,
    signature,
    cartLoaded,
  ]);

  useEffect(() => {
    const save = () =>
      writeStoredCheckoutFlow(pickCheckoutFlow(useCheckoutStore.getState()));
    save();
    const unsubscribe = useCheckoutStore.subscribe(save);
    return () => {
      unsubscribe();
      clearStoredCheckoutFlow();
    };
  }, []);
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
