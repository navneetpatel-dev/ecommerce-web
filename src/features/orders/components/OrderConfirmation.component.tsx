"use client";

import { motion } from "motion/react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { hasOrderPaymentSummaryContent } from "../utils/orderPaymentSummary.utils";
import { OrderPaymentSummary } from "./OrderPaymentSummary.component";
import { OrderMoneyBreakdown } from "./OrderMoneyBreakdown.component";
import { OrderConfirmationItems } from "./OrderConfirmationItems.component";
import { OrderConfirmationHero } from "./OrderConfirmationHero.component";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useOrder } from "../api/orders.queries";
import type { Order } from "@/shared/api/types";

interface OrderConfirmationProps {
  orderId: string | undefined;
}

function OrderItemsSkeleton() {
  return (
    <div
      className="space-y-4"
      aria-busy="true"
      aria-label={LABELS.orderDetailsLoading}
    >
      {[0, 1].map((group) => (
        <div
          key={group}
          className="border border-line bg-surface-raised px-4 py-3.5 shadow-elevation-1 sm:px-5"
        >
          <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex items-start gap-3 py-3 sm:gap-4">
            <Skeleton className="size-14 rounded-sm sm:size-16" />
            <div className="flex-1 space-y-2 pt-0.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = resolveQueryDetailState(useOrder(orderId ?? ""), {
    enabled: Boolean(orderId),
  });

  const showPaymentSummary =
    order != null && hasOrderPaymentSummaryContent(order as Order);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_14%,transparent),transparent_60%)]"
      />

      <motion.div
        className="storefront-container relative py-10 sm:py-12 lg:py-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      >
        <div className="mx-auto max-w-6xl">
          <OrderConfirmationHero orderId={orderId} />

          <div className="mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] lg:gap-10">
            <div className="min-w-0">
              <TextEyebrow>{LABELS.orderSummary}</TextEyebrow>
              <h2 className="mb-4 mt-1 font-display text-[1.375rem] text-ink">
                {LABELS.whatYouOrdered}
              </h2>

              {orderId && isOrderLoading ? <OrderItemsSkeleton /> : null}
              {order ? <OrderConfirmationItems order={order as Order} /> : null}

              {orderId && isOrderError && !isOrderLoading ? (
                <p className="border border-line bg-surface-raised p-5 text-center text-body-sm leading-relaxed text-ink-muted">
                  {LABELS.orderDetailsLoadFailed}
                </p>
              ) : null}

              <p className="mt-4 text-body-sm leading-relaxed text-ink-faint">
                Multi-vendor orders may arrive in more than one shipment — each
                maker handles their own fulfillment.
              </p>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-24">
              {orderId && isOrderLoading ? (
                <div className="space-y-3 border border-line bg-surface-raised p-5 shadow-elevation-1 sm:p-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="mt-4 h-7 w-1/2" />
                </div>
              ) : null}

              {order ? (
                <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1 sm:p-6">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
                  />
                  <TextEyebrow className="mb-4">
                    {LABELS.orderTotalsHeading}
                  </TextEyebrow>
                  <OrderMoneyBreakdown
                    order={order as Order}
                    className="space-y-2.5 text-[0.875rem]"
                  />
                  {showPaymentSummary ? (
                    <OrderPaymentSummary
                      order={order as Order}
                      className="mt-5 border-t border-line pt-5"
                    />
                  ) : null}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
