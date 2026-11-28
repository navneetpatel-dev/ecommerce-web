"use client";

import { ProductEligibleOffers } from "../../offers/ProductEligibleOffers.component";
import { CashbackOfferBadge } from "@/features/cashback";

interface ProductOffersProps {
  productId: string;
  categoryId?: string | null;
  /** The variant being viewed, so offers reflect its price. */
  variantId?: string;
}

/** The cashback badge and the coupons that apply to a product. */
export function ProductOffers({
  productId,
  categoryId,
  variantId,
}: ProductOffersProps) {
  return (
    <>
      <CashbackOfferBadge categoryId={categoryId} variant="detail" />
      <ProductEligibleOffers productId={productId} variantId={variantId} />
    </>
  );
}
