"use client";

import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { Button } from "@/shared/components/ui/button";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import { AmountsUnavailableNotice } from "@/shared/components/AmountsUnavailableNotice.component";
import { OrderTaxShippingBreakdown } from "@/shared/components/OrderTaxShippingBreakdown.component";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { CartMutationError } from "./CartMutationError.component";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { cartDrawerStyles as styles } from "./cartDrawer.styles";

interface CartSummaryLinkProps {
  href: string;
  label: string;
  disabled: boolean;
  onClose: () => void;
  variant?: "default" | "outline";
}

function CartSummaryLink({
  href,
  label,
  disabled,
  onClose,
  variant = "default",
}: CartSummaryLinkProps) {
  const linkButton = disabled ? (
    <Button
      type="button"
      variant={variant}
      className={styles.fullWidthButton}
      disabled
    >
      {label}
    </Button>
  ) : (
    <Button asChild variant={variant} className={styles.fullWidthButton}>
      <Link href={href} onClick={onClose}>
        {label}
      </Link>
    </Button>
  );

  return (
    <DisabledActionHint
      disabled={disabled}
      message={LABELS.cartUpdatingActionHint}
      block
    >
      {linkButton}
    </DisabledActionHint>
  );
}

interface CartDrawerSummaryProps {
  /** Server-computed preview; the drawer only renders the fields it shows. */
  pricingPreview?: {
    merchandiseSubtotal: number;
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
  };
  total: number | undefined;
  totalIsEstimated?: boolean;
  pendingLineTotals?: boolean;
  totalsFetching?: boolean;
  isCartMutating?: boolean;
  mutationError?: string | null;
  onDismissMutationError?: () => void;
  amountsUnavailable?: boolean;
  onRetryAmounts?: () => void;
  hasUnavailableItems?: boolean;
  onClose: () => void;
}

/** Drawer footer: server-computed totals plus the checkout call to action. */
export function CartDrawerSummary({
  pricingPreview,
  total,
  pendingLineTotals = false,
  totalsFetching = false,
  isCartMutating = false,
  mutationError = null,
  onDismissMutationError,
  amountsUnavailable = false,
  onRetryAmounts,
  hasUnavailableItems = false,
  onClose,
}: CartDrawerSummaryProps) {
  const amountsPending = pendingLineTotals && !amountsUnavailable;
  const totalRefreshing = total == null || amountsPending || totalsFetching;
  const dismissMutationError = onDismissMutationError ?? (() => undefined);

  const previewElement =
    pricingPreview || amountsPending ? (
      <dl className={styles.pricingList}>
        <div className={styles.subtotalRow}>
          <dt className={styles.subtotalLabel}>{LABELS.subtotal}</dt>
          <dd className={styles.subtotalValue}>
            {amountsPending ? (
              <InlineAmountSkeleton />
            ) : (
              <>₹{formatInrAmount(pricingPreview!.merchandiseSubtotal)}</>
            )}
          </dd>
        </div>
        <OrderTaxShippingBreakdown
          className={styles.taxShippingBreakdown}
          pending={amountsPending}
          shippingTotal={pricingPreview?.shippingTotal}
          shippingDisplayKey={pricingPreview?.shippingDisplayKey}
          taxTotal={pricingPreview?.taxTotal}
        />
      </dl>
    ) : null;

  const unavailableNoticeElement = amountsUnavailable ? (
    <AmountsUnavailableNotice onRetry={onRetryAmounts} />
  ) : null;

  const checkoutActionElement = hasUnavailableItems ? (
    <p className={styles.unavailableWarning}>
      {LABELS.removeUnavailableToCheckout}
    </p>
  ) : (
    <CartSummaryLink
      href={PATHS.checkout}
      label={LABELS.checkout}
      disabled={isCartMutating}
      onClose={onClose}
    />
  );

  return (
    <div className={styles.summaryContainer}>
      <CartMutationError
        message={mutationError}
        onDismiss={dismissMutationError}
      />
      {previewElement}

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>{LABELS.total}</span>
        <span className={styles.totalValue}>
          <MoneyAmount
            value={total}
            pending={totalRefreshing}
            unavailable={amountsUnavailable}
            fallbackClassName={styles.totalFallback}
          />
        </span>
      </div>

      {unavailableNoticeElement}
      {checkoutActionElement}

      <CartSummaryLink
        href={PATHS.cart}
        label={LABELS.viewFullCart}
        disabled={isCartMutating}
        onClose={onClose}
        variant="outline"
      />
    </div>
  );
}
