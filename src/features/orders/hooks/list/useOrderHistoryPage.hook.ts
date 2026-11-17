"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMyOrders } from "../../api/orders/orders.queries";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { navigate, navigateReplace } from "@/shared/utils/navigation/navigate";

function orderHistoryHref(
  pathname: string,
  currentSearch: string,
  nextPage: number,
) {
  const params = new URLSearchParams(currentSearch);
  if (nextPage <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(nextPage));
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function useOrderHistoryPage() {
  const role = useAuthStore((s) => s.currentUser?.role);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const currentSearch = searchParams.toString();

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: status.trim() || undefined,
    }),
    [search, status],
  );

  const { data, isLoading, isError, refetch } = useMyOrders(
    role,
    page,
    filters,
  );
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    if (!data || page <= data.totalPages) return;
    navigateReplace(
      router,
      orderHistoryHref(pathname, currentSearch, data.totalPages),
    );
  }, [currentSearch, data, page, pathname, router]);

  const onPageChange = (nextPage: number) => {
    const boundedPage = Math.min(Math.max(1, nextPage), totalPages);
    if (boundedPage === page) return;
    navigate(router, orderHistoryHref(pathname, currentSearch, boundedPage));
  };

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(currentSearch);
    if (val.trim()) params.set("search", val);
    else params.delete("search");
    params.delete("page");
    const qs = params.toString();
    navigate(router, qs ? `${pathname}?${qs}` : pathname);
  };

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(currentSearch);
    if (val.trim()) params.set("status", val);
    else params.delete("status");
    params.delete("page");
    const qs = params.toString();
    navigate(router, qs ? `${pathname}?${qs}` : pathname);
  };

  const handleClear = () => {
    const params = new URLSearchParams(currentSearch);
    params.delete("search");
    params.delete("status");
    params.delete("page");
    const qs = params.toString();
    navigate(router, qs ? `${pathname}?${qs}` : pathname);
  };

  const onRetry = () => void refetch();
  const isEmpty = !isLoading && data?.total === 0;
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 1;
  const from = total > 0 ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, total);

  return {
    isLoading,
    isError,
    onRetry,
    orders: data?.items ?? [],
    isEmpty,
    filters: {
      search,
      status,
      onSearchChange: handleSearchChange,
      onStatusChange: handleStatusChange,
      onClear: handleClear,
    },
    pagination: {
      currentPage: page,
      totalPages,
      total,
      from,
      to,
      onPageChange,
    },
  };
}
