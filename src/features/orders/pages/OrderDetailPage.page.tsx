"use client";

import Link from "next/link";
import { PackageX } from "lucide-react";
import { useOrderDetailPage } from "../hooks/useOrderDetailPage.hook";
import { OrderDetailContent } from "../components/OrderDetailContent.component";
import { OrderDetailSkeleton } from "../components/OrderDetailSkeleton.component";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { PATHS } from "@/shared/constants/paths";
import { ordersPagesStyles } from "./ordersPages.styles";

export function OrderDetailPage() {
  const detail = useOrderDetailPage();

  if (detail.isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (detail.notFound || !detail.order) {
    return (
      <div className={ordersPagesStyles.detailNotFoundWrapper}>
        <div aria-hidden className={ordersPagesStyles.detailNotFoundGlow} />
        <div className={ordersPagesStyles.detailNotFoundContainer}>
          <EmptyState
            icon={PackageX}
            eyebrow="Orders"
            heading="Order not found"
            message="This order may have been removed, or you may not have access to view it."
            actionLabel="Back to orders"
            actionTo={PATHS.orders}
          />
          <p className={ordersPagesStyles.detailNotFoundFooter}>
            Or{" "}
            <Link
              href={PATHS.products}
              className={ordersPagesStyles.detailContinueShoppingLink}
            >
              continue shopping
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return <OrderDetailContent order={detail.order} />;
}
