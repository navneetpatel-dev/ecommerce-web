"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import type { Order } from "@/shared/api/types";
import { SubOrderCardContainer } from "../containers/SubOrderCardContainer.container";
import { countOrderItems } from "../utils/format";
import { useOrderDocuments } from "../hooks/useOrderDocuments.hook";
import { OrderDetailHeader } from "./OrderDetailHeader.component";
import { OrderSummaryAside } from "./OrderSummaryAside.component";

interface OrderDetailContentProps {
  order: Order;
}

const HEADER_ENTRANCE = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.2, 0, 0, 1] as const },
};

function subOrderEntrance(index: number) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.28,
      delay: Math.min(0.04 * index, 0.16),
      ease: [0.2, 0, 0, 1] as const,
    },
  };
}

/** Order detail screen composition: header, sub-orders, summary aside. */
export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const itemCount = countOrderItems(order);
  const vendorCount = order.subOrders?.length ?? 0;
  const documents = useOrderDocuments(order);

  const renderSubOrder = (
    subOrder: NonNullable<Order["subOrders"]>[number],
    index: number,
  ) => (
    <motion.div key={subOrder.id} {...subOrderEntrance(index)}>
      <SubOrderCardContainer subOrder={subOrder} />
    </motion.div>
  );

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <motion.div {...HEADER_ENTRANCE}>
          <OrderDetailHeader
            order={order}
            itemCount={itemCount}
            vendorCount={vendorCount}
          />
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-8">
              {(order.subOrders ?? []).map(renderSubOrder)}
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <Link
                href={PATHS.products}
                className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-hover"
              >
                {LABELS.continueShopping}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[88px] lg:z-10 lg:self-start">
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
