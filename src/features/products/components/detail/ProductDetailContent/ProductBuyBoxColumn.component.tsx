"use client";

import { ProductHighlights } from "../ProductHighlights.component";
import { VariantSelector } from "../../variants/VariantSelector.component";
import { ProductSizeChartButton } from "../ProductSizeChartButton.component";
import { ProductHeadingBlock } from "./ProductHeadingBlock.component";
import { PriceAvailabilityBlock } from "./PriceAvailabilityBlock.component";
import { PurchasePanel } from "./PurchasePanel.component";
import { SellerPerksBlock } from "./SellerPerksBlock.component";
import { PATHS } from "@/shared/constants/paths/paths";
import type { ProductBuyBoxColumnProps } from "../../../types/detail/productBuyBox.types";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "../../../styles/detail/productDetailContent.styles";
import { ProductOffers } from "./ProductOffers.component";

export function ProductBuyBoxColumn({
  product,
  addSectionRef,
  resolvedVariant,
  sellerScore,
  avgRating,
  reviewCount,
  onReviewsClick,
  hideRating = false,
  preview = false,
  displayPrice,
  compareAtPrice,
  showMrp,
  discountPercent,
  gstPercentage,
  taxInclusiveEstimate,
  lowStockAt,
  displayStock,
  needsOptionSelection,
  variantUnavailable,
  canAddToCart,
  variantSelection,
  quantity,
  onQuantityChange,
  quantityMax,
  quantityDisabled,
  quantityDisabledHint,
  addDisabled,
  isSoldOut,
  addToCartHint,
  addToCartLabel,
  isAddingToCart,
  onDeliveryBlockedChange,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  freeShippingThreshold,
  returnWindowDays,
  returnsAllowed,
  warrantyTypeLabel,
}: ProductBuyBoxColumnProps) {
  return (
    <div
      className={PRODUCT_DETAIL_CONTENT_STYLES.buyBoxColumn}
      ref={addSectionRef}
    >
      <div className={PRODUCT_DETAIL_CONTENT_STYLES.buyBoxStack}>
        <ProductHeadingBlock
          product={product}
          sellerScore={sellerScore}
          avgRating={avgRating}
          reviewCount={reviewCount}
          onReviewsClick={onReviewsClick}
          hideRating={hideRating}
        />

        <PriceAvailabilityBlock
          displayPrice={displayPrice}
          compareAtPrice={compareAtPrice}
          showMrp={showMrp}
          discountPercent={discountPercent}
          gstPercentage={gstPercentage}
          taxInclusiveEstimate={taxInclusiveEstimate}
          hsnCode={product.displayHsnCode}
          sku={resolvedVariant?.sku}
          needsOptionSelection={needsOptionSelection}
          variantUnavailable={variantUnavailable}
          displayStock={displayStock}
          lowStockAt={lowStockAt}
        />

        {product.highlights?.length ? (
          <ProductHighlights highlights={product.highlights.slice(0, 4)} />
        ) : null}

        {product.sizeChartUrl ? (
          <ProductSizeChartButton
            url={product.sizeChartUrl}
            productName={product.name}
          />
        ) : null}

        {preview ? null : (
          <ProductOffers
            productId={product.id}
            categoryId={product.categoryId}
            variantId={variantSelection.matchedVariant?.id}
          />
        )}

        {product.variants && product.variants.length > 0 ? (
          <VariantSelector
            {...variantSelection}
            showAddToCart={false}
            optionsOnly
            lowStockAt={lowStockAt}
          />
        ) : null}

        <PurchasePanel
          productId={product.id}
          variantId={resolvedVariant?.id}
          vendorId={product.vendor?.id}
          needsOptionSelection={needsOptionSelection}
          variantUnavailable={variantUnavailable}
          canAddToCart={canAddToCart}
          displayStock={displayStock}
          codAvailable={product.codAvailable}
          codEligibleAtUnitPrice={
            resolvedVariant?.codEligibleAtUnitPrice ??
            product.codEligibleAtUnitPrice
          }
          codMinOrderValue={product.codMinOrderValue}
          codMaxOrderValue={product.codMaxOrderValue}
          onDeliveryBlockedChange={onDeliveryBlockedChange}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          quantityMax={quantityMax}
          quantityDisabled={quantityDisabled}
          quantityDisabledHint={quantityDisabledHint}
          addDisabled={addDisabled}
          offSale={Boolean(resolvedVariant?.aboveMrp)}
          isSoldOut={isSoldOut}
          addToCartHint={addToCartHint}
          addToCartLabel={addToCartLabel}
          isAddingToCart={isAddingToCart}
          isWishlisted={isWishlisted}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          productName={product.name}
          productUrl={PATHS.product(product.slug ?? product.id)}
          imageUrl={product.imageUrl}
          price={displayPrice}
          description={product.description}
          preview={preview}
        />

        <SellerPerksBlock
          product={product}
          freeShippingThreshold={freeShippingThreshold}
          returnWindowDays={returnWindowDays}
          returnsAllowed={returnsAllowed}
          warrantyTypeLabel={warrantyTypeLabel}
        />
      </div>
    </div>
  );
}
