"use client";

import Link from "next/link";
import type { ProductListItem } from "@/shared/api/types";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { DiscountBadge } from "@/shared/components/DiscountBadge.component";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { CARD_DETAILS_STYLES } from "../../../styles/card/cardDetails.styles";

interface CardDetailsProps {
  product: ProductListItem;
  /** GST-inclusive price the customer pays. */
  price: number;
  showMrp: boolean;
  discountPercent: number;
}

export function CardDetails({
  product,
  price,
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
        {product.hasPriceRange ? (
          <span className={CARD_DETAILS_STYLES.priceFrom}>
            {LABELS.priceFrom}
          </span>
        ) : null}
        <span className={CARD_DETAILS_STYLES.basePrice}>
          ₹{formatInrAmount(price)}
        </span>
        {showMrp && (
          <>
            <span className={CARD_DETAILS_STYLES.compareAtPrice}>
              ₹{formatInrAmount(product.compareAtPrice!)}
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
