"use client";

import { useMemo } from "react";
import { Gift, Heart, LifeBuoy, Package, RotateCcw, Star } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { PATHS } from "@/shared/constants/paths/paths";
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  orderItemSummary,
  shortOrderId,
} from "@/shared/utils/formatting/orderFormat";
import { useAccountOverview } from "../../hooks/overview/useAccountOverview.hook";

export interface RecentOrderViewModel {
  id: string;
  shortId: string;
  summary: string;
  date: string;
  formattedAmount: string;
  href: string;
}

export interface ActivitySummaryItem {
  id: string;
  icon: typeof Heart;
  label: string;
  value: string;
  href: string;
}

export function useOrdersActivitySection() {
  const {
    recentOrders,
    ordersCount,
    wishlistCount,
    reviewsCount,
    isLoadingReviews,
    isLoadingStats,
  } = useAccountOverview();

  const orderViewModels = useMemo<RecentOrderViewModel[]>(() => {
    return recentOrders.slice(0, 4).map((order) => ({
      id: order.id,
      shortId: `#${shortOrderId(order.id)}`,
      summary: `${orderItemSummary(order)} · ${countOrderItems(order)} items`,
      date: formatOrderDate(order.createdAt),
      formattedAmount: formatInr(order.totalAmount),
      href: PATHS.order(order.id),
    }));
  }, [recentOrders]);

  const ordersSubtitle = isLoadingStats ? "Loading…" : `${ordersCount} total`;
  const wishlistCountLabel = isLoadingStats ? "—" : String(wishlistCount);
  const reviewsCountLabel = isLoadingReviews ? "—" : String(reviewsCount);
  const ordersCountLabel = isLoadingStats ? "—" : String(ordersCount);

  const summaryItems = useMemo<ActivitySummaryItem[]>(
    () => [
      {
        id: "wishlist",
        icon: Heart,
        label: "Wishlist",
        value: wishlistCountLabel,
        href: PATHS.wishlist,
      },
      {
        id: "reviews",
        icon: Star,
        label: "Your reviews",
        value: reviewsCountLabel,
        href: PATHS.reviews,
      },
      {
        id: "returns",
        icon: RotateCcw,
        label: "Returns",
        value: "Manage",
        href: PATHS.myReturns,
      },
      {
        id: "supportTickets",
        icon: LifeBuoy,
        label: LABELS.overviewSupportTickets,
        value: LABELS.view,
        href: PATHS.supportTickets,
      },
      {
        id: "bugReports",
        icon: LifeBuoy,
        label: LABELS.overviewBugReports,
        value: LABELS.reportABug,
        href: PATHS.bugReports,
      },
      {
        id: "wallet",
        icon: Package,
        label: LABELS.wallet,
        value: LABELS.view,
        href: PATHS.wallet,
      },
      {
        id: "giftCards",
        icon: Gift,
        label: giftCardsLabels.giftCards,
        value: LABELS.view,
        href: "/gift-cards",
      },
      {
        id: "allOrders",
        icon: Package,
        label: LABELS.allOrders,
        value: ordersCountLabel,
        href: PATHS.orders,
      },
    ],
    [wishlistCountLabel, reviewsCountLabel, ordersCountLabel],
  );

  return {
    orderViewModels,
    isLoadingStats,
    ordersSubtitle,
    summaryItems,
  };
}
