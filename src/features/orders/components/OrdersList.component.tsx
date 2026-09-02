"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import type { Order } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { ContinueShoppingLink } from "@/shared/components/ContinueShoppingLink.component";
import { OrderStatusGroup } from "./OrderStatusGroup.component";
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  orderItemSummary,
  shortOrderId,
} from "../utils/format";
import { reportsEngineApi } from "@/features/reports";
import { CustomerOrderHistoryPanel } from "@/features/reports";

interface OrdersListProps {
  orders: Order[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function defaultHistoryRange() {
  const to = new Date();
  const from = new Date();
  from.setFullYear(to.getFullYear() - 2);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function OrdersList({ orders, pagination }: OrdersListProps) {
  const exportHistory = () => {
    const range = defaultHistoryRange();
    void reportsEngineApi.customerOrderHistoryExport(range);
  };
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <TextEyebrow brand>{LABELS.account}</TextEyebrow>
            <h1
              className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
              style={{ fontSize: "var(--text-display-sm)" }}
            >
              {LABELS.yourOrders}
            </h1>
            <p className="mt-2 max-w-xl text-body text-ink-muted">
              {LABELS.ordersPageHint}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={exportHistory}>
              {LABELS.exportOrderHistory}
            </Button>
            <ContinueShoppingLink />
          </div>
        </motion.header>

        {/* Column labels — desktop ledger header */}
        <div className="mt-8 hidden border-b border-line pb-2 md:grid md:grid-cols-[7rem_8rem_minmax(0,1fr)_7rem_minmax(9rem,auto)_1.5rem] md:gap-4">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            {LABELS.ordersColumnOrder}
          </span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            {LABELS.ordersColumnPlaced}
          </span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            {LABELS.ordersColumnItems}
          </span>
          <span className="text-right text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            {LABELS.ordersColumnTotal}
          </span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            {LABELS.ordersColumnStatus}
          </span>
          <span className="sr-only">{LABELS.ordersColumnOpen}</span>
        </div>

        <ul className="divide-y divide-line border-b border-line">
          {orders.map((order, index) => {
            const itemCount = countOrderItems(order);
            const vendorCount = order.subOrders?.length ?? 0;

            return (
              <motion.li
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: Math.min(index * 0.03, 0.15),
                  ease: [0.2, 0, 0, 1],
                }}
              >
                <Link
                  href={PATHS.order(order.id)}
                  className="group grid grid-cols-1 gap-3 py-4 transition-colors hover:bg-brand-subtle/40 md:grid-cols-[7rem_8rem_minmax(0,1fr)_7rem_minmax(9rem,auto)_1.5rem] md:items-center md:gap-4"
                >
                  <div className="flex items-center justify-between gap-2 md:block">
                    <span className="font-mono text-body-sm text-ink">
                      #{shortOrderId(order.id)}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand md:hidden"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>

                  <div className="text-body-sm text-ink-muted">
                    {formatOrderDate(order.createdAt)}
                    <span className="md:hidden">
                      {" · "}
                      {vendorCount}{" "}
                      {vendorCount === 1
                        ? LABELS.sellerSingular
                        : LABELS.sellerPlural}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-body text-ink group-hover:text-brand">
                      {orderItemSummary(order)}
                    </p>
                    <p className="mt-0.5 hidden text-[0.75rem] text-ink-faint md:block">
                      {vendorCount}{" "}
                      {vendorCount === 1
                        ? LABELS.sellerSingular
                        : LABELS.sellerPlural}
                      {" · "}
                      {itemCount}{" "}
                      {itemCount === 1
                        ? LABELS.itemSingular
                        : LABELS.itemPlural}
                    </p>
                  </div>

                  <p className="font-display text-[1.125rem] tabular-nums text-ink md:text-right">
                    {formatInr(order.totalAmount)}
                  </p>

                  <OrderStatusGroup
                    orderStatus={order.status}
                    paymentStatus={order.paymentStatus}
                    density="compact"
                  />

                  <ChevronRight
                    className="hidden h-4 w-4 justify-self-end text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand md:block"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <PaginationContainer
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
            />
          </div>
        )}

        <CustomerOrderHistoryPanel />
      </div>
    </div>
  );
}
