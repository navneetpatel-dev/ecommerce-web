import { useEffect } from "react";
import type { CheckoutQuote } from "@/shared/api/types";

interface UseCheckoutStepGuardsInput {
  groupedByVendor: Record<string, unknown>;
  ensureDefaultShippingMethods: (vendorIds: string[]) => void;
  paymentMethod: string | null;
  quote: CheckoutQuote | undefined;
  setPaymentMethod: (method: string | null) => void;
  setWalletAmountToUse: (amount: number) => void;
}

/**
 * Keeps checkout selections consistent with the live quote: seeds a default
 * shipping method per vendor, and clears a payment method the quote just
 * made unavailable (COD went out of range, or wallet balance dropped to 0).
 */
export function useCheckoutStepGuards({
  groupedByVendor,
  ensureDefaultShippingMethods,
  paymentMethod,
  quote,
  setPaymentMethod,
  setWalletAmountToUse,
}: UseCheckoutStepGuardsInput) {
  useEffect(() => {
    const vendorIds = Object.keys(groupedByVendor);
    if (!vendorIds.length) return;
    ensureDefaultShippingMethods(vendorIds);
  }, [groupedByVendor, ensureDefaultShippingMethods]);

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
}
