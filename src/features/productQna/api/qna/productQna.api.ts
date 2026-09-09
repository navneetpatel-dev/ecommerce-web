import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { ProductQuestion, ProductAnswer } from "@/shared/api/types";

export const productQnaApi = {
  forProduct: async (
    productId: string,
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ProductQuestion>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    const base = API.productQna.forProduct(productId);
    const res = await apiClient.getWithResponse<ProductQuestion[]>(
      qs ? `${base}?${qs}` : base,
    );
    return unwrapPaginatedList(res);
  },
  forVendorMe: () => apiClient.get<ProductQuestion[]>(API.productQna.vendorMe),
  ask: (body: { productId: string; question: string }) =>
    apiClient.post<ProductQuestion>(API.productQna.ask, body),
  answer: (questionId: string, body: { answer: string }) =>
    apiClient.post<ProductAnswer>(API.productQna.answer(questionId), body),
  moderate: (questionId: string, body: { status: "PUBLISHED" | "REJECTED" }) =>
    apiClient.patch<ProductQuestion>(API.productQna.moderate(questionId), body),
  pending: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ProductQuestion>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await apiClient.getWithResponse<ProductQuestion[]>(
      qs ? `${API.productQna.moderation}?${qs}` : API.productQna.moderation,
    );
    return unwrapPaginatedList(res);
  },
};
