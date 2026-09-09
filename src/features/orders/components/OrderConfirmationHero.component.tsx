"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { SuccessCheckmarkContainer } from "@/shared/containers/SuccessCheckmarkContainer.container";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { shortOrderId } from "../utils/format";
import { orderConfirmationStyles as styles } from "./orderConfirmation.styles";

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
    <div className={styles.heroRoot}>
      <div className={styles.heroInfo}>
        <div className={styles.heroBadgeRow}>
          <SuccessCheckmarkContainer className={styles.heroCheckmark} />
          <TextEyebrow brand>Thank you</TextEyebrow>
        </div>
        <div>
          <h1
            className={styles.heroHeading}
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            Order confirmed
          </h1>
          {orderId ? (
            <p className={styles.heroOrderId}>#{shortOrderId(orderId)}</p>
          ) : null}
          <p className={styles.heroSubtitle}>
            You&apos;ll get a shipping update by email for each seller&apos;s
            package separately.
          </p>
        </div>
      </div>

      <div className={styles.heroActions}>
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
