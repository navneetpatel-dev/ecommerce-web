"use client";

import Link from "next/link";
import type { ProductListItem } from "@/shared/api/types";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { DiscountBadge } from "@/shared/components/DiscountBadge.component";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { PATHS } from "@/shared/constants/paths";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface CardDetailsProps {
  product: ProductListItem;
  showMrp: boolean;
  discountPercent: number;
}

export function CardDetails({
  product,
  showMrp,
  discountPercent,
}: CardDetailsProps) {
  return (
    <div className="mt-3 space-y-1">
      <VendorStrip vendor={product.vendor} size="sm" />
      <Link href={PATHS.product(product.slug)}>
        <h3 className="font-sans text-body font-medium text-ink line-clamp-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
      </Link>
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-body font-semibold text-brand">
          ₹{formatInrAmount(product.basePrice)}
        </span>
        {showMrp && (
          <>
            <span className="font-sans text-body-sm text-ink-faint line-through">
              ₹{product.compareAtPrice!.toLocaleString("en-IN")}
            </span>
            <DiscountBadge>-{discountPercent}%</DiscountBadge>
          </>
        )}
      </div>
      <RatingStars
        value={product.avgRating}
        count={product.reviewCount}
        size="sm"
      />
    </div>
  );
}
