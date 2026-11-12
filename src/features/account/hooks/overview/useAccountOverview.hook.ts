"use client";

import { useQuery } from "@tanstack/react-query";
import { useMyOrders } from "@/features/orders";
import { useWishlist } from "@/features/wishlist";
import { reviewsApi, reviewKeys } from "@/features/reviews";
import { useAccountProfile } from "../../api/addresses/account.queries";
import type { Order } from "@/shared/api/types";

/** Customer account overview — storefront orders, wishlist and review stats. */
export function useAccountOverview() {
  const profileQuery = useAccountProfile();
  const ordersQuery = useMyOrders();
  const wishlistQuery = useWishlist();
  // One row is enough: the count comes from the pagination total.
  const reviewsQuery = useQuery({
    queryKey: [...reviewKeys.mine(), "count"],
    queryFn: () => reviewsApi.myReviews(1, 1),
  });

  const ordersPayload = ordersQuery.data;
  const orders: Order[] = Array.isArray(ordersPayload?.items)
    ? ordersPayload.items
    : [];
  const recentOrders = orders.slice(0, 5);

  return {
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error as Error | null,
    refetch: profileQuery.refetch,
    ordersCount: ordersPayload?.total ?? orders.length,
    wishlistCount: wishlistQuery.data?.items?.length ?? 0,
    reviewsCount: reviewsQuery.data?.total ?? 0,
    isLoadingReviews: reviewsQuery.isLoading,
    recentOrders,
    isLoadingStats: ordersQuery.isLoading || wishlistQuery.isLoading,
  };
}
