import { apiClient } from "@/shared/api/client/client";
import { buildSearchParams } from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  AddressInput,
  ShippingRate,
  CheckoutQuote,
  RazorpaySignaturePayload,
} from "@/shared/api/types";
import { usersApi } from "@/features/users";

export type PlaceOrderResponse = {
  orderId: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  checkoutConfigId?: string;
  /** Seeds Razorpay Checkout's own saved-methods UI for returning shoppers. */
  razorpayCustomerId?: string;
};

export type CancelCheckoutPayload = {
  orderId: string;
};

export type VerifyPaymentPayload = RazorpaySignaturePayload;

export const checkoutApi = {
  getAddresses: () => usersApi.getAddresses(),
  createAddress: (body: AddressInput) => usersApi.createAddress(body),
  getShippingRates: (
    pincode: string,
    options?: {
      method?: string;
      productId?: string;
      variantId?: string;
      vendorId?: string;
    },
  ) =>
    apiClient.get<ShippingRate[]>(
      `${API.shipping.rates}?${buildSearchParams({
        pincode,
        method: options?.method,
        productId: options?.productId,
        variantId: options?.variantId,
        vendorId: options?.vendorId,
      }).toString()}`,
    ),
  getCheckoutQuote: (body: {
    addressId: string;
    shippingMethodByVendor: Record<string, string>;
    couponCode?: string | null;
    /** Full stacked-coupon set — sent alongside `couponCode` for back-compat. */
    couponCodes?: string[];
    walletAmountToUse?: number;
    /** Drives the gift-wrap fee line in the live quote. */
    giftWrap?: boolean;
  }) => apiClient.post<CheckoutQuote>(API.checkout.quote, body),
  placeOrder: (body: {
    addressId: string;
    paymentMethod: string;
    couponCode?: string | null;
    couponCodes?: string[];
    shippingMethodByVendor: Record<string, string>;
    walletAmountToUse?: number;
    giftWrap?: boolean;
    giftMessage?: string;
  }) => apiClient.post<PlaceOrderResponse>(API.checkout.create, body),
  /** UX confirmation only — webhook is the source of truth for PAID. */
  verifyPayment: (payload: VerifyPaymentPayload) =>
    apiClient.post<{ verified: boolean }>(API.checkout.verify, payload),
  cancelCheckout: (payload: CancelCheckoutPayload) =>
    apiClient.post<{ restored: boolean; orderId: string }>(
      API.checkout.cancel,
      payload,
    ),
};
