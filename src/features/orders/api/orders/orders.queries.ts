import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROLES } from "@/shared/constants/labels";
import { ordersApi, subOrdersApi } from "./orders.api";

/** Centralized, stable cache keys for order queries (§3). */
export const ordersKeys = {
  all: ["orders"] as const,
  mine: (role: string | undefined, page: number) =>
    [...ordersKeys.all, "mine", role ?? null, page] as const,
  detail: (id: string) => [...ordersKeys.all, "detail", id] as const,
};

function isVendorRole(role?: string) {
  return role === ROLES.VENDOR_OWNER || role === ROLES.VENDOR_STAFF;
}

export function useMyOrders(role?: string, page = 1) {
  return useQuery({
    queryKey: ordersKeys.mine(role, page),
    queryFn: () =>
      isVendorRole(role)
        ? subOrdersApi.vendorSubOrders(page)
        : ordersApi.myOrders(page),
    placeholderData: (prev) => prev,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => ordersApi.detail(id),
    enabled: !!id,
  });
}

export function useCancelOrder(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ordersApi.cancel(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersKeys.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}
