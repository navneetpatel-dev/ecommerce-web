"use client";

import { useCallback } from "react";
import {
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect.component";
import { ordersApi } from "@/features/orders";
import { vendorsApi } from "@/features/vendors";
import { formatOrderOption } from "../../utils/form/utils";

type FetchPage = (
  query: InfiniteSingleSelectPageQuery,
) => Promise<InfiniteSingleSelectPageResult>;

export function useFetchOrdersPage(): FetchPage {
  return useCallback<FetchPage>(async (query) => {
    const result = await ordersApi.myOrders(query.page, query.limit);
    return {
      items: result.items.map((order) => ({
        id: order.id,
        label: formatOrderOption(order),
      })),
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
    };
  }, []);
}

export function useFetchVendorsPage(): FetchPage {
  return useCallback<FetchPage>(async (query) => {
    const result = await vendorsApi.directory({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });
    return {
      items: result.items.map((vendor) => ({
        id: vendor.id,
        label: vendor.businessName,
      })),
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
    };
  }, []);
}

export type { FetchPage as TicketPickerFetchPage };
