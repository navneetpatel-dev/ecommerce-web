"use client";

import { Breadcrumbs } from "@/shared/components/Breadcrumbs.component";
import { ProductRelatedRails } from "../../related/ProductRelatedRails.component";
import { ProductGallery } from "../../gallery/ProductGallery.component";
import { ProductBuyBoxColumn } from "./ProductBuyBoxColumn.component";
import { DetailTabsSection } from "./DetailTabsSection.component";
import { StickyAddToCartBar } from "./StickyAddToCartBar.component";
import { useProductDetailContent } from "../../../hooks/detail/useProductDetailContent.hook";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "../../../styles/detail/productDetailContent.styles";
import type { ProductDetailContentProps } from "../../../types/detail/types";

export function ProductDetailContent({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  isAddingToCart = false,
  canAddToCart = true,
  needsOptionSelection = false,
  variantUnavailable = false,
  selectedImage,
  onSelectImage,
  quantity,
  onQuantityChange,
  maxQuantity,
  showStickyBar = false,
  addSectionRef,
  breadcrumbItems,
  variantSelection,
  freeShippingThreshold,
  returnWindowDays,
  returnsAllowed,
}: ProductDetailContentProps) {
  const {
    setDeliveryBlocked,
    detailTab,
    setDetailTab,
    displayStock,
    quantityMax,
    addDisabled,
    quantityDisabled,
    quantityDisabledHint,
    reviewCount,
    avgRating,
    formattedPrice,
    compareAtPrice,
    showMrp,
    discountPercent,
    taxInclusiveEstimate,
    resolvedVariant,
    lowStockAt,
    warrantyTypeLabel,
    sellerScore,
    categoryName,
    addToCartLabel,
    stickyAddLabel,
    addToCartHint,
    isStickyBarVisible,
    handleReviewsClick,
  } = useProductDetailContent({
    product,
    variantSelection,
    maxQuantity,
    canAddToCart,
    needsOptionSelection,
    variantUnavailable,
    isAddingToCart,
    showStickyBar,
  });

  return (
    <div className={PRODUCT_DETAIL_CONTENT_STYLES.container}>
      <Breadcrumbs
        items={breadcrumbItems}
        className={PRODUCT_DETAIL_CONTENT_STYLES.breadcrumbs}
      />

      <div className={PRODUCT_DETAIL_CONTENT_STYLES.layoutGrid}>
        <ProductGallery
          product={product}
          resolvedVariant={resolvedVariant}
          selectedImage={selectedImage}
          onSelect={onSelectImage}
        />

        <ProductBuyBoxColumn
          product={product}
          addSectionRef={addSectionRef}
          resolvedVariant={resolvedVariant}
          sellerScore={sellerScore}
          avgRating={avgRating}
          reviewCount={reviewCount}
          onReviewsClick={handleReviewsClick}
          formattedPrice={formattedPrice}
          compareAtPrice={compareAtPrice}
          showMrp={showMrp}
          discountPercent={discountPercent}
          gstPercentage={Number(product.gstPercentage ?? 0)}
          taxInclusiveEstimate={taxInclusiveEstimate}
          lowStockAt={lowStockAt}
          displayStock={displayStock}
          needsOptionSelection={needsOptionSelection}
          variantUnavailable={variantUnavailable}
          canAddToCart={canAddToCart}
          variantSelection={variantSelection}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          quantityMax={quantityMax}
          quantityDisabled={quantityDisabled}
          quantityDisabledHint={quantityDisabledHint}
          addDisabled={addDisabled}
          addToCartHint={addToCartHint}
          addToCartLabel={addToCartLabel}
          isAddingToCart={isAddingToCart}
          onDeliveryBlockedChange={setDeliveryBlocked}
          isWishlisted={isWishlisted}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          freeShippingThreshold={freeShippingThreshold}
          returnWindowDays={returnWindowDays}
          returnsAllowed={returnsAllowed}
          warrantyTypeLabel={warrantyTypeLabel}
        />
      </div>

      <DetailTabsSection
        product={product}
        detailTab={detailTab}
        onTabChange={setDetailTab}
        resolvedVariant={resolvedVariant}
        categoryName={categoryName}
        displayStock={displayStock}
        reviewCount={reviewCount}
      />

      <ProductRelatedRails
        productId={product.id}
        categoryId={product.categoryId}
        vendorId={product.vendor?.id}
      />

      <StickyAddToCartBar
        visible={isStickyBarVisible}
        productName={product.name}
        formattedPrice={formattedPrice}
        addDisabled={addDisabled}
        addToCartHint={addToCartHint}
        addLabel={stickyAddLabel}
        isAddingToCart={isAddingToCart}
        quantity={quantity}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
