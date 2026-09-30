import { useEffect } from "react";
import type { CheckoutQuote } from "@/shared/api/types";
import { useCheckoutStore } from "../../store/checkout.store";
import { canAdvanceFromPayment } from "../../utils/checkout/checkoutDerivedState";
import { resolveCheckoutStepCap } from "../../utils/checkout/checkoutSession.utils";

interface UseCheckoutStepGuardsInput {
  groupedByVendor: Record<string, unknown>;
  /** True once every vendor has a shipping method with a rate for the chosen address. */
  shippingReady: boolean;
  /** True once the address list has loaded — before that, "no address" is not a verdict. */
  addressesResolved: boolean;
  quote: CheckoutQuote | undefined;
  /** True once the quote came back (or failed) for the current selections. */
  quoteResolved: boolean;
}

/**
 * Keeps the step and the selections consistent with the live cart and quote (Rule 3).
 *
 * It seeds a default shipping method per vendor, drops selections the cart no longer
 * supports, clears a payment method the quote just made unavailable (COD went out of
 * range, wallet balance dropped to 0), and clamps the step to the furthest one those
 * selections still justify — so a deleted address or an out-of-range payment method can't
 * leave a customer parked on review.
 */
export function useCheckoutStepGuards({
  groupedByVendor,
  shippingReady,
  addressesResolved,
  quote,
  quoteResolved,
}: UseCheckoutStepGuardsInput) {
  const {
    step,
    setStep,
    addressId,
    paymentMethod,
    walletAmountToUse,
    setPaymentMethod,
    setWalletAmountToUse,
    ensureDefaultShippingMethods,
    pruneShippingMethods,
  } = useCheckoutStore();

  useEffect(() => {
    const vendorIds = Object.keys(groupedByVendor);
    if (!vendorIds.length) return;
    ensureDefaultShippingMethods(vendorIds);
    // A vendor that left the basket takes its method with it: the quote is keyed by the
    // vendors still in it, so a leftover entry would keep quoting a basket that isn't there.
    pruneShippingMethods(vendorIds);
  }, [groupedByVendor, ensureDefaultShippingMethods, pruneShippingMethods]);

  useEffect(() => {
    if (paymentMethod === "cod" && quote && quote.codAvailable === false) {
      setPaymentMethod(null);
      return;
    }
    if (paymentMethod === "wallet" && quote) {
      const max = quote.maxWalletApplicable ?? 0;
      const balance = quote.walletBalance ?? 0;
      if (balance <= 0 || max <= 0) {
        setPaymentMethod(null);
        setWalletAmountToUse(0);
      }
    }
  }, [paymentMethod, quote, setPaymentMethod, setWalletAmountToUse]);

  useEffect(() => {
    const cap = resolveCheckoutStepCap({
      // While the address list is loading there is nothing to judge: treat it as chosen so
      // the customer isn't pulled back to step 1 for a frame.
      addressChosen: Boolean(addressId) || !addressesResolved,
      quoteResolved,
      shippingReady,
      paymentValid: canAdvanceFromPayment(
        paymentMethod,
        quote,
        walletAmountToUse,
      ),
    });
    if (step > cap) setStep(cap);
  }, [
    step,
    setStep,
    addressId,
    addressesResolved,
    quote,
    quoteResolved,
    shippingReady,
    paymentMethod,
    walletAmountToUse,
  ]);
}
