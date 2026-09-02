"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { SuccessCheckmarkContainer } from "@/shared/containers/SuccessCheckmarkContainer.container";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { shortOrderId } from "../utils/format";

interface OrderConfirmationHeroProps {
  orderId: string | undefined;
}

/**
 * Confirmation banner.
 *
 * Laid out as a wide band rather than a column so the message and its actions
 * sit side by side — stacking them left of the summary stranded most of the
 * viewport on large screens.
 */
export function OrderConfirmationHero({ orderId }: OrderConfirmationHeroProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
        <SuccessCheckmarkContainer />

        <div className="min-w-0">
          <TextEyebrow brand>Thank you</TextEyebrow>
          <h1
            className="mt-1.5 font-display leading-[1.1] tracking-tight text-ink"
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            Order confirmed
          </h1>
          {orderId ? (
            <p className="mt-2 font-mono text-body-sm text-ink-muted">
              #{shortOrderId(orderId)}
            </p>
          ) : null}
          <p className="mt-3 max-w-lg text-body leading-relaxed text-ink-muted">
            You&apos;ll get a shipping update by email for each seller&apos;s
            package separately.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:justify-center lg:justify-end">
        <Button asChild>
          <Link href={orderId ? PATHS.order(orderId) : PATHS.orders}>
            View order
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={PATHS.products}>{LABELS.continueShopping}</Link>
        </Button>
      </div>
    </div>
  );
}
