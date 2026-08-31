"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { SuccessCheckmarkContainer } from "@/shared/containers/SuccessCheckmarkContainer.container";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { shortOrderId } from "../utils/format";
import { hasOrderPaymentSummaryContent } from "../utils/orderPaymentSummary.utils";
import { OrderPaymentSummary } from "./OrderPaymentSummary.component";
import { useOrder } from "../api/orders.queries";
import type { Order } from "@/shared/api/types";

interface OrderConfirmationProps {
  orderId: string | undefined;
}

function OrderPaymentSummarySkeleton() {
  return (
    <div
      className="mx-auto mt-6 max-w-sm rounded-md border border-line bg-surface-raised px-4 py-4 text-left"
      aria-busy="true"
      aria-label={LABELS.orderDetailsLoading}
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
    </div>
  );
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useOrder(orderId ?? "");

  const showPaymentSummary =
    order != null && hasOrderPaymentSummaryContent(order as Order);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_14%,transparent),transparent_50%)]"
      />

      <motion.div
        className="storefront-container relative py-16 text-center md:py-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      >
        <div className="mx-auto max-w-lg">
          <SuccessCheckmarkContainer />
          <TextEyebrow brand className="mt-6">
            Thank you
          </TextEyebrow>
          <h1
            className="mt-2 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            Order confirmed
          </h1>
          {orderId ? (
            <p className="mt-3 font-mono text-body-sm text-ink-muted">
              #{shortOrderId(orderId)}
            </p>
          ) : null}
          <p className="mx-auto mt-4 max-w-sm text-body leading-relaxed text-ink-muted">
            You&apos;ll get a shipping update by email for each seller&apos;s
            package separately.
          </p>

          {orderId && isOrderLoading ? <OrderPaymentSummarySkeleton /> : null}

          {showPaymentSummary ? (
            <div className="mx-auto mt-6 max-w-sm rounded-md border border-line bg-surface-raised px-4 py-4 text-left">
              <OrderPaymentSummary order={order as Order} />
            </div>
          ) : null}

          {orderId && isOrderError && !isOrderLoading ? (
            <p className="mx-auto mt-6 max-w-sm text-body-sm leading-relaxed text-ink-muted">
              {LABELS.orderDetailsLoadFailed}
            </p>
          ) : null}

          <p className="mx-auto mt-2 max-w-sm text-body-sm leading-relaxed text-ink-faint">
            Multi-vendor orders may arrive in more than one shipment — each
            maker handles their own fulfillment.
          </p>
          <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
            <Button variant="secondary" asChild>
              <Link href={PATHS.products}>{LABELS.continueShopping}</Link>
            </Button>
            <Button asChild>
              <Link href={orderId ? PATHS.order(orderId) : PATHS.orders}>
                View order
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
