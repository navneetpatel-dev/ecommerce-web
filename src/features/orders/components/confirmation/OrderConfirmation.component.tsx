"use client";

import { motion } from "motion/react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { OrderPaymentSummary } from "../detail/OrderPaymentSummary.component";
import { OrderMoneyBreakdown } from "../detail/OrderMoneyBreakdown.component";
import { OrderConfirmationItems } from "./OrderConfirmationItems.component";
import { OrderConfirmationHero } from "./OrderConfirmationHero.component";
import { useOrderConfirmation } from "../../hooks/confirmation/useOrderConfirmation.hook";
import { orderConfirmationStyles as styles } from "../../styles/confirmation/orderConfirmation.styles";

const SKELETON_GROUPS = [0, 1];

interface OrderConfirmationProps {
  orderId: string | undefined;
}

function OrderItemsSkeleton() {
  return (
    <div
      className={styles.skeletonRoot}
      aria-busy="true"
      aria-label={LABELS.orderDetailsLoading}
    >
      {SKELETON_GROUPS.map((group) => (
        <div key={group} className={styles.skeletonCard}>
          <div className={styles.skeletonCardHeader}>
            <Skeleton className={styles.itemHeaderTitle} />
            <Skeleton className={styles.itemHeaderMeta} />
          </div>
          <div className={styles.skeletonCardBody}>
            <Skeleton className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <Skeleton className={styles.itemName} />
              <Skeleton className={styles.itemQty} />
            </div>
            <Skeleton className={styles.itemPrice} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const { order, showPaymentSummary, showItemsSkeleton, showLoadError } =
    useOrderConfirmation(orderId);

  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.radialBg} />

      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      >
        <div className={styles.contentWrapper}>
          <OrderConfirmationHero orderId={orderId} />

          <div className={styles.grid}>
            <div className={styles.mainCol}>
              <TextEyebrow>{LABELS.orderSummary}</TextEyebrow>
              <h2 className={styles.sectionHeading}>{LABELS.whatYouOrdered}</h2>

              {showItemsSkeleton ? <OrderItemsSkeleton /> : null}
              {order ? <OrderConfirmationItems order={order} /> : null}

              {showLoadError ? (
                <p className={styles.errorNotice}>
                  {LABELS.orderDetailsLoadFailed}
                </p>
              ) : null}

              <p className={styles.disclaimer}>
                Multi-vendor orders may arrive in more than one shipment — each
                maker handles their own fulfillment.
              </p>
            </div>

            <aside className={styles.aside}>
              <TextEyebrow>{LABELS.orderTotalsHeading}</TextEyebrow>
              <h2 className={styles.sectionHeading}>{LABELS.whatYouPaid}</h2>

              {showItemsSkeleton ? (
                <div className={styles.asideLoadingCard}>
                  <Skeleton className={styles.asideLabel} />
                  <Skeleton className={styles.asideLine1} />
                  <Skeleton className={styles.asideLine2} />
                  <Skeleton className={styles.asideTotal} />
                </div>
              ) : null}

              {order ? (
                <div className={styles.asidePaidCard}>
                  <div aria-hidden className={styles.accentStripe} />
                  <OrderMoneyBreakdown
                    order={order}
                    className={styles.moneyBreakdown}
                  />
                  {showPaymentSummary ? (
                    <OrderPaymentSummary
                      order={order}
                      className={styles.paymentSummary}
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
