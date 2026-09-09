"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { contentDocStyles as styles } from "./contentDoc.styles";

/** Educational returns overview — real requests go through order history. */
export function ReturnsView() {
  return (
    <div className={styles.returnsContainer}>
      <h1 className={styles.h1Display}>Returns</h1>
      <p className={styles.bodyText}>
        Eligible items can be returned from your order history. Open an order,
        choose the item, and submit a return request. Our team reviews each
        request before pickup and refund.
      </p>
      <ol className={styles.orderedList}>
        <li>Request a return from a delivered order item</li>
        <li>Wait for approval from support or the seller</li>
        <li>Schedule pickup if required</li>
        <li>Item received and inspected</li>
        <li>Refund issued to the original payment method</li>
      </ol>
      <div className={styles.actionsRow}>
        <Button asChild>
          <Link href={PATHS.orders}>{LABELS.goToMyOrders}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={PATHS.myReturns}>View my returns</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={PATHS.help}>{LABELS.helpCenter}</Link>
        </Button>
      </div>
    </div>
  );
}
