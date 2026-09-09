"use client";

import Link from "next/link";
import type { ProductListItem } from "@/shared/api/types";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { DiscountBadge } from "@/shared/components/DiscountBadge.component";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { CARD_DETAILS_STYLES } from "../../../styles/card/cardDetails.styles";

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
    <div className={CARD_DETAILS_STYLES.root}>
      <VendorStrip vendor={product.vendor} size="sm" />
      <Link href={PATHS.product(product.slug)}>
        <h3 className={CARD_DETAILS_STYLES.title}>{product.name}</h3>
      </Link>
      <div className={CARD_DETAILS_STYLES.priceRow}>
        <span className={CARD_DETAILS_STYLES.basePrice}>
          ₹{formatInrAmount(product.basePrice)}
        </span>
        {showMrp && (
          <>
            <span className={CARD_DETAILS_STYLES.compareAtPrice}>
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
