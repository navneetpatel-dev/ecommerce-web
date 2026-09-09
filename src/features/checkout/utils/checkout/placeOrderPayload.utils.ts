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
}

/**
 * Wallet pays via points on a Razorpay checkout; the backend has no WALLET
 * payment-method enum, so wallet recharges are placed as a `razorpay` order
 * with the wallet amount attached.
 */
export function buildPlaceOrderPayload({
  method,
  addressId,
  appliedCouponCode,
  couponCodes,
  shippingMethodByVendor,
  walletAmountToUse,
  giftWrap,
  giftMessage,
}: BuildPlaceOrderPayloadInput): {
  apiPaymentMethod: string;
  apiWalletAmount: number;
  payload: PlaceOrderBody;
} {
  const apiPaymentMethod = method === "wallet" ? "razorpay" : method;
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
    },
  };
}
