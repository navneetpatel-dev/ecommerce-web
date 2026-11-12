import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationMeta,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { RazorpaySignaturePayload } from "@/shared/api/types";

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

export type GiftCardStatus = GiftCardPublicView["status"];

type GiftCardPerson = { id: string; name: string | null; email: string } | null;

/** A gift card as its buyer, redeemer or an admin sees it. */
export type GiftCardView = {
  id: string;
  code: string;
  amount: number;
  status: GiftCardStatus;
  recipientEmail: string;
  recipientName: string | null;
  message: string | null;
  purchasedAt: string;
  expiresAt: string;
  redeemedAt: string | null;
  purchaser?: GiftCardPerson;
  redeemer?: GiftCardPerson;
};

/** Sent and redeemed cards, each paged on its own (B-44). */
export type MyGiftCards = {
  purchased: GiftCardView[];
  redeemed: GiftCardView[];
  purchasedPagination: PaginationMeta;
  redeemedPagination: PaginationMeta;
};

export type MyGiftCardsSide = "purchased" | "redeemed";

export type GiftCardLiability = {
  outstanding: number;
  outstandingCount: number;
  redeemed: number;
  expired: number;
  cancelled: number;
  issued: number;
};

export type AdminGiftCardListParams = {
  page?: number;
  limit?: number;
  status?: GiftCardStatus;
  search?: string;
};

export const giftCardsApi = {
  purchase: (payload: PurchaseGiftCardPayload) =>
    apiClient.post<GiftCardCheckout>(API.giftCards.purchase, payload),
  verify: (payload: RazorpaySignaturePayload & { giftCardId?: string }) =>
    apiClient.post<GiftCardVerifyResult>(API.giftCards.verify, payload),
  redeem: (code: string) =>
    apiClient.post<GiftCardRedeemResult>(API.giftCards.redeem, { code }),
  getByCode: (code: string) =>
    apiClient.get<GiftCardPublicView>(API.giftCards.byCode(code)),
  /** One page of one side; the other side's first page rides along and is ignored. */
  mine: async (
    side: MyGiftCardsSide,
    page = 1,
  ): Promise<PaginatedList<GiftCardView>> => {
    const body = await apiClient.get<MyGiftCards>(
      withQuery(API.giftCards.mine, { [`${side}Page`]: page }),
    );
    const meta = body[`${side}Pagination`];
    return { items: body[side], ...meta };
  },
  resend: (id: string) =>
    apiClient.post<{ sent: true }>(API.giftCards.resend(id), {}),
  adminList: async (
    params: AdminGiftCardListParams,
  ): Promise<PaginatedList<GiftCardView>> => {
    const res = await apiClient.getWithResponse<GiftCardView[]>(
      withQuery(API.giftCards.adminList, params),
    );
    return unwrapPaginatedList(res);
  },
  adminLiability: () =>
    apiClient.get<GiftCardLiability>(API.giftCards.adminLiability),
  adminCancel: (id: string, reason: string) =>
    apiClient.post<GiftCardView>(API.giftCards.adminCancel(id), { reason }),
};
