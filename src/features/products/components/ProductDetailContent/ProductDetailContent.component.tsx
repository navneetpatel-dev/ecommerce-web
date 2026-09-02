"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs.component";
import { ProductRelatedRails } from "../ProductRelatedRails.component";
import { ProductGallery } from "./ProductGallery.component";
import { ProductBuyBoxColumn } from "./ProductBuyBoxColumn.component";
import { DetailTabsSection } from "./DetailTabsSection.component";
import { StickyAddToCartBar } from "./StickyAddToCartBar.component";
import { LABELS } from "@/shared/constants/labels";
import { cartLineQuantityMax } from "@/shared/constants/cart";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import { VARIANT_LOW_STOCK_DEFAULT } from "../../constants/productFields";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import {
  getAddToCartHint,
  getAddToCartLabel,
  getQuantityDisabledHint,
  getStickyAddLabel,
} from "./labels";
import type { ProductDetailContentProps } from "./types";

export function ProductDetailContent({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  isAddingToCart,
  canAddToCart = true,
  needsOptionSelection = false,
  variantUnavailable = false,
  selectedImage,
  onSelectImage,
  quantity,
  onQuantityChange,
  maxQuantity,
  showStickyBar,
  addSectionRef,
  breadcrumbItems,
  variantSelection,
  freeShippingThreshold,
  returnWindowDays,
  returnsAllowed,
}: ProductDetailContentProps) {
  const [deliveryBlocked, setDeliveryBlocked] = useState(false);
  const [detailTab, setDetailTab] = useState("description");
  const displayPrice = Number(
    variantSelection.currentPrice || product.basePrice || 0,
  );
  const displayStock = Number(
    variantSelection.currentStock || product.stock || 0,
  );
  const quantityMax = maxQuantity ?? cartLineQuantityMax(displayStock);
  const purchaseBlocked = Boolean(!canAddToCart || deliveryBlocked);
  const addDisabled = Boolean(purchaseBlocked || isAddingToCart);
  const quantityDisabled = purchaseBlocked;
  const quantityDisabledHint = getQuantityDisabledHint({
    needsOptionSelection,
    variantUnavailable,
    canAddToCart,
  });
  const reviewCount = product.reviewCount ?? 0;
  const avgRating = product.avgRating ?? 0;
  const formattedPrice = formatInrAmount(displayPrice);
  const compareAtPrice = product.compareAtPrice ?? null;
  const showMrp = product.showMrp ?? false;
  const discountPercent = product.discountPercent ?? null;
  const taxInclusiveEstimate = product.taxInclusivePrice ?? null;

  const resolvedVariant =
    variantSelection.matchedVariant ??
    (product.variants?.length === 1 ? product.variants[0] : null);

  const lowStockAt = Number(
    resolvedVariant?.lowStockAt ?? VARIANT_LOW_STOCK_DEFAULT,
  );
  const warrantyTypeLabel =
    product.displayWarrantyType === WARRANTY_TYPE.SELLER
      ? LABELS.warrantySeller
      : LABELS.warrantyManufacturer;
  const sellerScore =
    product.vendorPerformanceScore ?? product.vendor?.performanceScore ?? null;

  const categoryName = product.category?.name ?? product.categoryName ?? null;

  const addToCartLabel = getAddToCartLabel({
    needsOptionSelection,
    variantUnavailable,
    displayStock,
  });

  const stickyAddLabel = getStickyAddLabel(
    needsOptionSelection,
    variantUnavailable,
    formattedPrice,
  );

  const addToCartHint = getAddToCartHint({
    needsOptionSelection,
    variantUnavailable,
    displayStock,
    deliveryBlocked,
    isAddingToCart,
  });

  return (
    <div className="storefront-container pb-10 pt-4 sm:pt-6 md:pb-14 md:pt-8">
      <Breadcrumbs items={breadcrumbItems} className="mb-5 sm:mb-6" />

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-10 xl:gap-14">
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
          onReviewsClick={() => setDetailTab("reviews")}
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
        visible={
          showStickyBar &&
          (displayStock > 0 || needsOptionSelection || variantUnavailable)
        }
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
