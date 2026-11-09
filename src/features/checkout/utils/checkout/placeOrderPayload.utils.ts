import type { checkoutApi } from "../../api/checkout/checkout.api";

type PlaceOrderBody = Parameters<typeof checkoutApi.placeOrder>[0];

interface BuildPlaceOrderPayloadInput {
  method: string;
  addressId: string;
  appliedCouponCode: string | null;
  couponCodes: string[] | undefined;
  shippingMethodByVendor: Record<string, string>;
  walletAmountToUse: number;
  giftWrap: boolean;
  giftMessage: string;
  expectedGrandTotal?: number;
}

/**
 * Wallet pays via points on a Razorpay checkout; the backend has no WALLET
 * payment-method enum, so wallet recharges are placed as a `razorpay` order
 * with the wallet amount attached.
 */
/** The checkout step's method as the API takes it: paying with points is a Razorpay order. */
export function toApiPaymentMethod(method: string): string {
  return method === "wallet" ? "razorpay" : method;
}

export function buildPlaceOrderPayload({
  method,
  addressId,
  appliedCouponCode,
  couponCodes,
  shippingMethodByVendor,
  walletAmountToUse,
  giftWrap,
  giftMessage,
  expectedGrandTotal,
}: BuildPlaceOrderPayloadInput): {
  apiPaymentMethod: string;
  apiWalletAmount: number;
  payload: PlaceOrderBody;
} {
  const apiPaymentMethod = toApiPaymentMethod(method);
  const apiWalletAmount = method === "wallet" ? walletAmountToUse : 0;

  return {
    apiPaymentMethod,
    apiWalletAmount,
    payload: {
      addressId,
      paymentMethod: apiPaymentMethod,
      couponCode: appliedCouponCode || undefined,
      couponCodes,
      shippingMethodByVendor,
      walletAmountToUse: apiWalletAmount,
      giftWrap,
      giftMessage: giftWrap ? giftMessage.trim() || undefined : undefined,
      expectedGrandTotal,
    },
  };
}
