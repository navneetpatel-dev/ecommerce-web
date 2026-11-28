"use client";

import Link from "next/link";
import { BellRing } from "lucide-react";
import { NotifyMeButton } from "@/features/stockAlerts";
import { Button } from "@/shared/components/ui/button";
import { stockAlertsLabels } from "@/shared/constants/labels/stockAlerts";
import { PATHS } from "@/shared/constants/paths/paths";
import type { ProductListItem } from "@/shared/api/types";

interface WishlistNotifyActionProps {
  product: Pick<ProductListItem, "slug" | "variants">;
}

/**
 * Back-in-stock for a sold-out wishlist product. With one option it subscribes here; with several
 * the shopper picks theirs on the product page, where each has its own "Notify me".
 */
export function WishlistNotifyAction({ product }: WishlistNotifyActionProps) {
  const variants = product.variants ?? [];
  const only = variants[0]?.id;
  if (!only) return null;
  if (variants.length === 1) return <NotifyMeButton variantId={only} />;
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={PATHS.product(product.slug)}>
        <BellRing size={14} />
        {stockAlertsLabels.notifyMeChooseOption}
      </Link>
    </Button>
  );
}
