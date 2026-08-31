import { apiClient } from "@/shared/api/client";
import { API } from "@/shared/constants/apiRoutes";
import type { Address, ShippingRate, CheckoutQuote } from "@/shared/api/types";
import { usersApi } from "@/features/users";

export type PlaceOrderResponse = {
  orderId: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  checkoutConfigId?: string;
};

export type CancelCheckoutPayload = {
  orderId: string;
};

export type VerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export const checkoutApi = {
  getAddresses: () => usersApi.getAddresses(),
  createAddress: (body: Omit<Address, "id" | "userId">) =>
    usersApi.createAddress(body),
  getShippingRates: (
    pincode: string,
    weight?: number,
    options?: {
      method?: string;
      productId?: string;
      variantId?: string;
      vendorId?: string;
    },
  ) => {
    const params = new URLSearchParams({ pincode });
    if (weight != null) params.set("weight", String(weight));
    if (options?.method) params.set("method", options.method);
    if (options?.productId) params.set("productId", options.productId);
    if (options?.variantId) params.set("variantId", options.variantId);
    if (options?.vendorId) params.set("vendorId", options.vendorId);
    return apiClient.get<ShippingRate[]>(
      `${API.shipping.rates}?${params.toString()}`,
    );
  },
  getCheckoutQuote: (body: {
    addressId: string;
    shippingMethodByVendor: Record<string, string>;
    couponCode?: string | null;
    walletAmountToUse?: number;
  }) => apiClient.post<CheckoutQuote>(API.checkout.quote, body),
  placeOrder: (body: {
    addressId: string;
    paymentMethod: string;
    couponCode?: string | null;
    shippingMethodByVendor: Record<string, string>;
    walletAmountToUse?: number;
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
