import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationMeta,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";

export type CashbackOfferState = "LIVE" | "SCHEDULED" | "ENDED" | "OFF";
export type CashbackPaymentMethod = "RAZORPAY" | "COD";

/** A platform cashback offer. On `/live`, `categoryIds` already lists every sub-category. */
export type CashbackOffer = {
  id: string;
  name: string;
  percent: number;
  maxCashback: number | null;
  minOrderValue: number;
  categoryIds: string[];
  paymentMethods: CashbackPaymentMethod[];
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  state: CashbackOfferState;
};

export type CashbackOfferInput = {
  name: string;
  percent: number;
  maxCashback: number | null;
  minOrderValue: number;
  categoryIds: string[];
  paymentMethods: CashbackPaymentMethod[];
  startsAt?: string;
  endsAt: string | null;
  isActive: boolean;
};

export type CashbackEntryStatus = "PENDING" | "CREDITED" | "CANCELLED";

export type CashbackEntry = {
  orderId: string;
  placedAt: string;
  amount: number;
  status: CashbackEntryStatus;
  expectedCreditOn: string | null;
  creditedAt: string | null;
  couponCodes: string[];
  offerName: string | null;
};

export type CashbackHistory = {
  items: CashbackEntry[];
  totals: { pending: number; credited: number };
  pagination: PaginationMeta;
};

export type PageParams = { page?: number; limit?: number };

export const cashbackApi = {
  liveOffers: () => apiClient.get<CashbackOffer[]>(API.cashback.liveOffers),
  history: (params: PageParams) =>
    apiClient.get<CashbackHistory>(withQuery(API.cashback.history, params)),
  adminList: async (
    params: PageParams,
  ): Promise<PaginatedList<CashbackOffer>> => {
    const res = await apiClient.getWithResponse<CashbackOffer[]>(
      withQuery(API.cashback.adminOffers, params),
    );
    return unwrapPaginatedList(res);
  },
  adminCreate: (input: CashbackOfferInput) =>
    apiClient.post<CashbackOffer>(API.cashback.adminOffers, input),
  adminUpdate: (id: string, input: Partial<CashbackOfferInput>) =>
    apiClient.patch<CashbackOffer>(API.cashback.adminOffer(id), input),
  adminDelete: (id: string) =>
    apiClient.delete<{ deleted: true }>(API.cashback.adminOffer(id)),
};
