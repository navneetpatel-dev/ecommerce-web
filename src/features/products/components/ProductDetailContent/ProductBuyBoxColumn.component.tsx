"use client";

import type { RefObject } from "react";
import { ProductHighlights } from "../ProductHighlights.component";
import { VariantSelector } from "../VariantSelector.component";
import { ProductEligibleOffers } from "../ProductEligibleOffers.component";
import { ProductSizeChartButton } from "../ProductSizeChartButton.component";
import { ProductHeadingBlock } from "./ProductHeadingBlock.component";
import { PriceAvailabilityBlock } from "./PriceAvailabilityBlock.component";
import { PurchasePanel } from "./PurchasePanel.component";
import { SellerPerksBlock } from "./SellerPerksBlock.component";
import { PATHS } from "@/shared/constants/paths";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";
import type { VariantSelectionProps } from "./types";

interface ProductBuyBoxColumnProps {
  product: ProductDetail;
  addSectionRef: RefObject<HTMLDivElement | null>;
  resolvedVariant: ProductVariant | null;
  sellerScore: number | null;
  avgRating: number;
  reviewCount: number;
  onReviewsClick: () => void;
  formattedPrice: string;
  compareAtPrice: number | null;
  showMrp: boolean;
  discountPercent: number | null;
  gstPercentage: number;
  taxInclusiveEstimate: number | null;
  lowStockAt: number;
  displayStock: number;
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  canAddToCart: boolean;
  variantSelection: VariantSelectionProps;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  quantityMax: number;
  quantityDisabled: boolean;
  quantityDisabledHint: string;
  addDisabled: boolean;
  addToCartHint: string;
  addToCartLabel: string;
  isAddingToCart?: boolean;
  onDeliveryBlockedChange: (blocked: boolean) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart?: (quantity: number) => void;
  freeShippingThreshold?: number;
  returnWindowDays?: number | null;
  returnsAllowed?: boolean;
  warrantyTypeLabel: string;
}

export function ProductBuyBoxColumn({
  product,
  addSectionRef,
  resolvedVariant,
  sellerScore,
  avgRating,
  reviewCount,
  onReviewsClick,
  formattedPrice,
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
    <div className="min-w-0 md:col-span-6 lg:col-span-5" ref={addSectionRef}>
      <div className="space-y-5 lg:space-y-6">
        <ProductHeadingBlock
          product={product}
          sellerScore={sellerScore}
          avgRating={avgRating}
          reviewCount={reviewCount}
          onReviewsClick={onReviewsClick}
        />

        <PriceAvailabilityBlock
          formattedPrice={formattedPrice}
          compareAtPrice={compareAtPrice}
          showMrp={showMrp}
          discountPercent={discountPercent}
          hasPriceChange={variantSelection.hasPriceChange}
          basePrice={variantSelection.basePrice}
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

        <ProductEligibleOffers productId={product.id} />

        {product.variants && product.variants.length > 0 ? (
          <VariantSelector
            attributeGroups={variantSelection.attributeGroups}
            currentPrice={variantSelection.currentPrice}
            currentStock={variantSelection.currentStock}
            basePrice={variantSelection.basePrice}
            hasPriceChange={variantSelection.hasPriceChange}
            isAvailable={variantSelection.isAvailable}
            isActive={variantSelection.isActive}
            onSelectValue={variantSelection.onSelectValue}
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
          displayPrice={Number(
            variantSelection.currentPrice || product.basePrice || 0,
          )}
          codAvailable={product.codAvailable}
          codMinOrderValue={product.codMinOrderValue}
          codMaxOrderValue={product.codMaxOrderValue}
          onDeliveryBlockedChange={onDeliveryBlockedChange}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          quantityMax={quantityMax}
          quantityDisabled={quantityDisabled}
          quantityDisabledHint={quantityDisabledHint}
          addDisabled={addDisabled}
          addToCartHint={addToCartHint}
          addToCartLabel={addToCartLabel}
          isAddingToCart={isAddingToCart}
          isWishlisted={isWishlisted}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          productName={product.name}
          productUrl={PATHS.product(product.slug ?? product.id)}
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
