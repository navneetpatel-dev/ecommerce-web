"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { ContinueShoppingLink } from "@/shared/components/ContinueShoppingLink.component";
import type { Order } from "@/shared/api/types";
import { countOrderItems } from "../utils/format";
import { useOrderDocuments } from "../hooks/useOrderDocuments.hook";
import { OrderDetailHeader } from "./OrderDetailHeader.component";
import { OrderSummaryAside } from "./OrderSummaryAside.component";
import { OrderReturnStatusBanner } from "./OrderReturnStatusBanner.component";
import { SubOrdersList } from "./SubOrdersList.component";
import { ORDER_DETAIL_CONTENT_STYLES } from "./orderDetailContent.styles";

interface OrderDetailContentProps {
  order: Order;
}

const HEADER_ENTRANCE = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.2, 0, 0, 1] as const },
};

/** Order detail screen composition: header, sub-orders, summary aside. */
export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const itemCount = countOrderItems(order);
  const vendorCount = order.subOrders?.length ?? 0;
  const documents = useOrderDocuments(order);
  const subOrders = useMemo(() => order.subOrders ?? [], [order.subOrders]);

  return (
    <div className={ORDER_DETAIL_CONTENT_STYLES.root}>
      <div
        aria-hidden
        className={ORDER_DETAIL_CONTENT_STYLES.radialBackground}
      />

      <div className={ORDER_DETAIL_CONTENT_STYLES.container}>
        <motion.div {...HEADER_ENTRANCE}>
          <OrderDetailHeader
            order={order}
            itemCount={itemCount}
            vendorCount={vendorCount}
          />
          <div className={ORDER_DETAIL_CONTENT_STYLES.bannerWrapper}>
            <OrderReturnStatusBanner order={order} />
          </div>
        </motion.div>

        <div className={ORDER_DETAIL_CONTENT_STYLES.layoutGrid}>
          <div className={ORDER_DETAIL_CONTENT_STYLES.mainCol}>
            <SubOrdersList subOrders={subOrders} />

            <div
              className={ORDER_DETAIL_CONTENT_STYLES.continueShoppingContainer}
            >
              <ContinueShoppingLink />
            </div>
          </div>

          <aside className={ORDER_DETAIL_CONTENT_STYLES.aside}>
            <OrderSummaryAside
              order={order}
              itemCount={itemCount}
              invoicePending={documents.invoicePending}
              pendingSubOrderId={documents.pendingSubOrderId}
              invoiceError={documents.invoiceError}
              onDownloadAllInvoices={documents.downloadAllInvoices}
              onDownloadSubOrderInvoice={documents.downloadSubOrderInvoice}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
