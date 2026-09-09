"use client";

import { LABELS } from "@/shared/constants/labels";
import { RecentlyViewedSection } from "./RecentlyViewedSection.component";
import { useProductRelatedRails } from "../../hooks/related/useProductRelatedRails.hook";
import { ProductRelatedRailSection } from "./ProductRelatedRailSection.component";
import { productRelatedRailsStyles } from "../../styles/related/productRelatedRails.styles";

interface ProductRelatedRailsProps {
  productId: string;
  categoryId?: string | null;
  vendorId?: string | null;
}

export function ProductRelatedRails({
  productId,
  categoryId,
  vendorId,
}: ProductRelatedRailsProps) {
  const {
    ref,
    fbtItems,
    fbtLoading,
    relatedItems,
    relatedLoading,
    sellerItems,
    sellerLoading,
    recent,
    showFbt,
    showRelated,
    showSeller,
  } = useProductRelatedRails({
    productId,
    categoryId,
    vendorId,
  });

  return (
    <div ref={ref} className={productRelatedRailsStyles.container}>
      {showFbt ? (
        <ProductRelatedRailSection
          eyebrow={LABELS.frequentlyBoughtTogether}
          title={LABELS.frequentlyBoughtTogether}
          products={fbtItems}
          loading={fbtLoading}
        />
      ) : null}

      {showRelated ? (
        <ProductRelatedRailSection
          eyebrow={LABELS.relatedProducts}
          title={LABELS.relatedProducts}
          products={relatedItems}
          loading={relatedLoading}
        />
      ) : null}

      {showSeller ? (
        <ProductRelatedRailSection
          eyebrow={LABELS.moreFromSeller}
          title={LABELS.moreFromSeller}
          products={sellerItems}
          loading={sellerLoading}
        />
      ) : null}

      <RecentlyViewedSection products={recent} />
    </div>
  );
}
