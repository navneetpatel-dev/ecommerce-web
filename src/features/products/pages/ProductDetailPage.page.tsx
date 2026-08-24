"use client";

import { useProductDetail } from "../hooks/useProductDetail.hook";
import { ProductDetailSkeleton } from "../components/ProductDetailSkeleton.component";
import { ProductNotFound } from "../components/ProductNotFound.component";
import { ProductDetailContent } from "../components/ProductDetailContent";

export function ProductDetailPage() {
  const detail = useProductDetail();

  if (detail.isLoading) return <ProductDetailSkeleton />;
  if (!detail.product) {
    return detail.isError ? (
      <ProductNotFound variant="error" onRetry={detail.retryProduct} />
    ) : (
      <ProductNotFound />
    );
  }

  return (
    <ProductDetailContent
      product={detail.product}
      isWishlisted={detail.isWishlisted}
      onToggleWishlist={detail.toggleWishlist}
      onAddToCart={detail.onAddToCart}
      isAddingToCart={detail.isAddingToCart}
      canAddToCart={detail.canAddToCart}
      needsOptionSelection={detail.needsOptionSelection}
      variantUnavailable={detail.variantUnavailable}
      selectedImage={detail.selectedImage}
      onSelectImage={detail.setSelectedImage}
      quantity={detail.quantity}
      onQuantityChange={detail.setQuantity}
      maxQuantity={detail.maxQuantity}
      showStickyBar={detail.showStickyBar}
      addSectionRef={detail.addSectionRef}
      breadcrumbItems={detail.breadcrumbItems}
      variantSelection={detail.variantSelection}
      freeShippingThreshold={detail.freeShippingThreshold}
      returnWindowDays={detail.returnWindowDays}
      returnsAllowed={detail.returnsAllowed}
    />
  );
}
