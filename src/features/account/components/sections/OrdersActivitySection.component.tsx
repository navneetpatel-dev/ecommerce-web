"use client";

import Link from "next/link";
import {
  ChevronRight,
  Gift,
  Heart,
  LifeBuoy,
  Package,
  RotateCcw,
  Star,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { PATHS } from "@/shared/constants/paths";
import { useAccountOverview } from "../../hooks/useAccountOverview.hook";
import { SummaryRow } from "./SummaryRow.component";
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  orderItemSummary,
  shortOrderId,
} from "@/shared/utils/orderFormat";

export function OrdersActivitySection() {
  const {
    recentOrders,
    ordersCount,
    wishlistCount,
    reviewsCount,
    isLoadingReviews,
    isLoadingStats,
  } = useAccountOverview();

  const preview = recentOrders.slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="border border-line bg-surface shadow-elevation-1">
        <div className="flex items-start justify-between gap-4 border-b border-line bg-paper/65 px-5 py-4 md:px-6">
          <div className="min-w-0">
            <TextEyebrow>Recent</TextEyebrow>
            <h2 className="mt-1 font-display text-[1.1875rem] leading-tight tracking-tight text-ink">
              Recent orders
            </h2>
            <p className="mt-1 text-body-sm text-ink-muted">
              {isLoadingStats ? "Loading…" : `${ordersCount} total`}
            </p>
          </div>
          <Link
            href={PATHS.orders}
            className="inline-flex shrink-0 items-center gap-1 self-center text-body-sm font-medium text-brand hover:text-brand-hover"
          >
            View all
            <ChevronRight size={14} />
          </Link>
        </div>

        {isLoadingStats ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : preview.length === 0 ? (
          <p className="px-5 py-10 text-center text-body text-ink-muted">
            No orders yet.{" "}
            <Link
              href={PATHS.products}
              className="font-medium text-brand hover:underline"
            >
              Start shopping
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {preview.map((order) => (
              <li key={order.id}>
                <Link
                  href={PATHS.order(order.id)}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper md:px-6"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink">
                      #{shortOrderId(order.id)}
                    </p>
                    <p className="mt-0.5 truncate text-body-sm text-ink-muted">
                      {orderItemSummary(order)} · {countOrderItems(order)} items
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-faint">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium tabular-nums text-ink">
                    {formatInr(order.totalAmount)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ul className="divide-y divide-line border border-line bg-surface shadow-elevation-1">
        <SummaryRow
          icon={Heart}
          label="Wishlist"
          value={isLoadingStats ? "—" : String(wishlistCount)}
          href={PATHS.wishlist}
        />
        <SummaryRow
          icon={Star}
          label="Your reviews"
          value={isLoadingReviews ? "—" : String(reviewsCount)}
          href={PATHS.reviews}
        />
        <SummaryRow
          icon={RotateCcw}
          label="Returns"
          value="Manage"
          href={PATHS.myReturns}
        />
        <SummaryRow
          icon={LifeBuoy}
          label={LABELS.overviewSupportTickets}
          value={LABELS.view}
          href={PATHS.supportTickets}
        />
        <SummaryRow
          icon={LifeBuoy}
          label={LABELS.overviewBugReports}
          value={LABELS.reportABug}
          href={PATHS.bugReports}
        />
        <SummaryRow
          icon={Package}
          label={LABELS.wallet}
          value={LABELS.view}
          href={PATHS.wallet}
        />
        <SummaryRow
          icon={Gift}
          label={giftCardsLabels.giftCards}
          value={LABELS.view}
          href="/gift-cards"
        />
        <SummaryRow
          icon={Package}
          label={LABELS.allOrders}
          value={isLoadingStats ? "—" : String(ordersCount)}
          href={PATHS.orders}
        />
      </ul>
    </div>
  );
}
