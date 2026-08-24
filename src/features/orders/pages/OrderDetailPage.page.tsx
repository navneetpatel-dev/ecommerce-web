"use client";

import Link from "next/link";
import { PackageX } from "lucide-react";
import { useOrderDetailPage } from "../hooks/useOrderDetailPage.hook";
import { OrderDetailContent } from "../components/OrderDetailContent.component";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths";

export function OrderDetailPage() {
  const detail = useOrderDetailPage();

  if (detail.isLoading) {
    return (
      <div className="storefront-container space-y-4 py-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-64 w-full lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (detail.notFound || !detail.order) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
        />
        <div className="storefront-container relative py-16 md:py-20">
          <EmptyState
            icon={PackageX}
            eyebrow="Orders"
            heading="Order not found"
            message="This order may have been removed, or you may not have access to view it."
            actionLabel="Back to orders"
            actionTo={PATHS.orders}
          />
          <p className="mt-4 text-center text-body-sm text-ink-faint">
            Or{" "}
            <Link
              href={PATHS.products}
              className="text-brand underline-offset-2 hover:underline"
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
