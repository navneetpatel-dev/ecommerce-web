import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "./users.api.hook";
import { ordersApi } from "@/features/orders";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";

export const adminUserKeys = {
  all: ["admin", "users"] as const,
  detail: (id: string) => [...adminUserKeys.all, "detail", id] as const,
  addresses: (id: string) => [...adminUserKeys.all, "addresses", id] as const,
  orders: (id: string, page: number) =>
    [...adminUserKeys.all, "orders", id, page] as const,
};

export function useAdminUser(id: string | undefined) {
  return useQuery({
    queryKey: adminUserKeys.detail(id ?? ""),
    queryFn: () => adminUsersApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useAdminUserAddresses(id: string | undefined) {
  return useQuery({
    queryKey: adminUserKeys.addresses(id ?? ""),
    queryFn: () => adminUsersApi.getAddresses(id!),
    enabled: Boolean(id),
  });
}

/** Admin-only: orders scoped to a single user (GET /orders?userId=...). */
export function useAdminUserOrders(
  id: string | undefined,
  page = 1,
  limit = DEFAULT_PAGE_LIMIT,
) {
  return useQuery({
    queryKey: adminUserKeys.orders(id ?? "", page),
    queryFn: () => ordersApi.myOrders(page, limit, id),
    enabled: Boolean(id),
    placeholderData: (prev) => prev,
  });
}
