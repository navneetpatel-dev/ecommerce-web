"use client";

import { ProductHeroCard } from "./ProductHeroCard.component";
import { ProductGalleryCard } from "./ProductGalleryCard.component";
import { ProductDescriptionCard } from "./ProductDescriptionCard.component";
import { ProductVariantsCard } from "./ProductVariantsCard.component";
import { ProductSpecsCard } from "./ProductSpecsCard.component";
import { ProductPricingPoliciesCard } from "./ProductPricingPoliciesCard.component";
import { ProductVendorCard } from "./ProductVendorCard.component";

interface ProductRecordDetailViewProps {
  product: Record<string, unknown>;
}

export function isProductRecord(record: Record<string, unknown>): boolean {
  if (
    record.productName &&
    (record.basePrice != null ||
      record.price != null ||
      record.variants != null)
  ) {
    return true;
  }
  if (
    record.name &&
    (record.basePrice != null ||
      record.displayPrice != null ||
      record.variants != null ||
      record.specs != null)
  ) {
    return true;
  }
  if (Array.isArray(record.variants) && record.variants.length > 0) {
    return true;
  }
  if (record.basePrice != null && record.stock != null) {
    return true;
  }
  return false;
}

export function ProductRecordDetailView({
  product,
}: ProductRecordDetailViewProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <ProductHeroCard product={product} />
      <ProductGalleryCard product={product} />
      <ProductDescriptionCard product={product} />
      <ProductVariantsCard product={product} />
      <ProductSpecsCard product={product} />
      <ProductPricingPoliciesCard product={product} />
      <ProductVendorCard product={product} />
    </div>
  );
}
