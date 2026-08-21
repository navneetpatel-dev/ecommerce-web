"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMyOrders } from "../api/orders.queries";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { navigate } from "@/shared/utils/navigate";

export function useOrderHistoryPage() {
  const role = useAuthStore((s) => s.currentUser?.role);
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading } = useMyOrders(role, page);

  const onPageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }
    const query = params.toString();
    navigate(router, query ? `?${query}` : window.location.pathname);
  };

  return {
    isLoading,
    orders: data?.items ?? [],
    isEmpty: !isLoading && !data?.items.length,
    pagination: {
      currentPage: data?.page ?? page,
      totalPages: data?.totalPages ?? 1,
      onPageChange,
    },
  };
}
