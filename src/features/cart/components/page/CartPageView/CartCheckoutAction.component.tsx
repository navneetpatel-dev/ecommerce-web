"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";
import { cartPageViewStyles as styles } from "../../../styles/page/cartPageView.styles";

interface CartCheckoutActionProps {
  hasUnavailableItems: boolean;
  /** The checked delivery area has no rates for a vendor in this cart. */
  isDeliveryAreaBlocked: boolean;
}

/**
 * The cart's way into checkout, and the two things that close it: items that can't be
 * bought, and a delivery area we don't ship to (an address can't fix the latter, so the
 * delivery chip above is the way out).
 */
export function CartCheckoutAction({
  hasUnavailableItems,
  isDeliveryAreaBlocked,
}: CartCheckoutActionProps) {
  if (hasUnavailableItems || isDeliveryAreaBlocked) {
    return (
      <p className={cn(styles.asideWarningBanner)}>
        {hasUnavailableItems
          ? LABELS.removeUnavailableToCheckout
          : LABELS.deliveryAreaChangeToContinue}
      </p>
    );
  }

  return (
    <Button asChild className={styles.asideCheckoutButton} size="lg">
      <Link href={PATHS.checkout} className={styles.asideCheckoutLink}>
        {LABELS.checkout}
        <ArrowRight size={16} />
      </Link>
    </Button>
  );
}
