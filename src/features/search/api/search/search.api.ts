import { apiClient } from "@/shared/api/client/client";
import { unwrapPaginatedList } from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { SearchProductsRouteParams } from "@/shared/constants/apiRoutes/discovery.routes";
import type { ProductListItem } from "@/shared/api/types";
import type { SearchSuggestion } from "../../types/search/index";

export const searchApi = {
  autocomplete: (term: string) =>
    apiClient.get<SearchSuggestion[]>(API.search.autocomplete(term)),
  /** Ranked full-text product search (`GET /api/search`) — returns the same shape as the product grid. */
  search: async (params: SearchProductsRouteParams) => {
    const res = await apiClient.getWithResponse<ProductListItem[]>(
      API.search.query(params),
    );
    return unwrapPaginatedList(res);
  },
};
