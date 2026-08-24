"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMyOrders } from "../api/orders.queries";
import { useAuthStore } from "@/shared/stores/auth.store";
import { navigate } from "@/shared/utils/navigate";

export function useOrderHistoryPage() {
  const role = useAuthStore((s) => s.currentUser?.role);
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, refetch } = useMyOrders(role, page);

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

  const onRetry = () => void refetch();
  const isEmpty = !isLoading && !data?.items.length;
  const currentPage = data?.page ?? page;
  const totalPages = data?.totalPages ?? 1;

  return {
    isLoading,
    isError,
    onRetry,
    orders: data?.items ?? [],
    isEmpty,
    pagination: {
      currentPage,
      totalPages,
      onPageChange,
    },
  };
}
