import type { CartItem, CheckoutQuote } from "@/shared/api/types";

export function hasUnavailableCartItems(
  items: CartItem[] | undefined,
): boolean {
  return (items ?? []).some((item) => item.isAvailable === false);
}

export function isShippingReadyForAllVendors(
  groupedByVendor: Record<string, unknown>,
  shippingMethodByVendor: Record<string, string | undefined>,
): boolean {
  return Object.keys(groupedByVendor).every((vendorId) =>
    Boolean(shippingMethodByVendor[vendorId]),
  );
}

export function canAdvanceFromPayment(
  paymentMethod: string | null,
  quote: CheckoutQuote | undefined,
  walletAmountToUse: number,
): boolean {
  if (!paymentMethod) return false;
  if (paymentMethod === "cod" && quote?.codAvailable !== true) return false;
  if (paymentMethod === "wallet") {
    return walletAmountToUse > 0;
  }
  return true;
}
