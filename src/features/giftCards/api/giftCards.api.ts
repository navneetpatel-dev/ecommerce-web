import { apiClient } from "@/shared/api/client";
import { API } from "@/shared/constants/apiRoutes";

export type GiftCardCheckout = {
  giftCardId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  checkoutConfigId?: string;
};

export type GiftCardVerifyResult = {
  giftCardId: string;
  status: string;
  code: string;
  amount: number;
};

export type GiftCardRedeemResult = {
  amount: number;
  balance: number;
  code: string;
};

export type GiftCardPublicView = {
  amount: number;
  status:
    "PENDING" | "ACTIVE" | "REDEEMED" | "EXPIRED" | "CANCELLED" | "FAILED";
  expiresAt: string;
};

export type PurchaseGiftCardPayload = {
  amount: number;
  recipientEmail: string;
  recipientName?: string;
  message?: string;
};

export const giftCardsApi = {
  purchase: (payload: PurchaseGiftCardPayload) =>
    apiClient.post<GiftCardCheckout>(API.giftCards.purchase, payload),
  verify: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    giftCardId?: string;
  }) => apiClient.post<GiftCardVerifyResult>(API.giftCards.verify, payload),
  redeem: (code: string) =>
    apiClient.post<GiftCardRedeemResult>(API.giftCards.redeem, { code }),
  getByCode: (code: string) =>
    apiClient.get<GiftCardPublicView>(API.giftCards.byCode(code)),
};
