"use client";

import { ShoppingBag } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { EmptyState } from "@/shared/components/EmptyState.component";

export function EmptyCart() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />
      <div className="storefront-container relative py-16 md:py-20">
        <EmptyState
          icon={ShoppingBag}
          heading={LABELS.cartEmptyHeading}
          message={LABELS.cartEmptyMessage}
          actionLabel={LABELS.continueShopping}
          actionTo={PATHS.products}
        />
      </div>
    </div>
  );
}
