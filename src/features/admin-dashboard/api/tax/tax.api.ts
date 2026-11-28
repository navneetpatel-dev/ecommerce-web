import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  buildSearchParams,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";

/** A tax rule; the price band (both fields or neither) charges a higher GST above a per-piece value. */
export type TaxRuleInput = {
  gstPercentage: number;
  hsnCode?: string | null;
  /** Empty or null: the platform default rule. */
  categoryId?: string | null;
  /** Per-piece value in ₹ above which `gstPercentageAbove` applies. */
  priceBandThreshold?: number | null;
  gstPercentageAbove?: number | null;
};

/** A rule as the admin list returns it. */
export type TaxRuleRow = {
  id: string;
  categoryId: string | null;
  categoryName: string | null;
  isDefault: boolean;
  hsnCode: string | null;
  gstPercentage: number;
  priceBandThreshold: number | null;
  gstPercentageAbove: number | null;
  /** How many categories this rule decides the GST of. */
  appliesToCount: number;
  createdAt: string;
};

export type TaxRuleChange =
  | { action: "create"; rule: TaxRuleInput }
  | { action: "update"; ruleId: string; rule: Partial<TaxRuleInput> }
  | { action: "delete"; ruleId: string };

/** Live and pending listings whose options would stop selling above their MRP. */
export type MrpImpact = {
  productCount: number;
  variantCount: number;
  vendorCount: number;
};

export type TaxRuleFilters = PaginationQuery & {
  search?: string;
  gstPercentage?: number;
  hasBand?: "YES" | "NO";
  scope?: "default" | "category";
  categoryId?: string;
};

/** Which rule a category gets, and where it comes from. */
export type EffectiveTaxRule = {
  categoryId: string;
  categoryName: string;
  ruleId: string | null;
  source: "own" | "inherited" | "default" | "fallback";
  fromCategoryId: string | null;
  fromCategoryName: string | null;
  gstPercentage: number;
  hsnCode: string | null;
  priceBandThreshold: number | null;
  gstPercentageAbove: number | null;
};

export const taxApi = {
  getRules: async (
    params: TaxRuleFilters = {},
  ): Promise<PaginatedList<TaxRuleRow>> => {
    const qs = buildSearchParams({ ...params }).toString();
    const res = await apiClient.getWithResponse<TaxRuleRow[]>(
      qs ? `${API.tax.rules}?${qs}` : API.tax.rules,
    );
    return unwrapPaginatedList(res);
  },
  createRule: (body: TaxRuleInput) =>
    apiClient.post<unknown>(API.tax.rules, body),
  updateRule: (id: string, body: Partial<TaxRuleInput>) =>
    apiClient.patch<unknown>(API.tax.rule(id), body),
  /** `force` is needed for the platform default rule. */
  deleteRule: (id: string, options: { force?: boolean } = {}) =>
    apiClient.delete(API.tax.rule(id, options.force ? "?force=true" : "")),
  /** What a rule change would put above its MRP, before it is saved. */
  impact: (change: TaxRuleChange) =>
    apiClient.post<MrpImpact>(API.tax.impact, change),
  effective: (categoryId: string) =>
    apiClient.get<EffectiveTaxRule>(API.tax.effective(categoryId)),
};
