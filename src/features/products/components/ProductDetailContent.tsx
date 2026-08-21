"use client";

import { useState, type RefObject } from "react";
import Link from "next/link";
import { ImageGalleryContainer } from "@/shared/containers/ImageGalleryContainer";
import { ProductInfo } from "./ProductInfo";
import { ProductHighlights } from "./ProductHighlights";
import { ProductSpecifications } from "./ProductSpecifications";
import { VariantSelector } from "./VariantSelector";
import { ProductReviewsContainer } from "@/features/reviews";
import { ShareButtonContainer } from "@/shared/containers/ShareButtonContainer";
import { VendorStrip } from "@/shared/components/VendorStrip";
import { RatingStars } from "@/shared/components/RatingStars";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { QuantitySelector } from "@/shared/components/QuantitySelector";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Heart, RotateCcw, Shield, Truck } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { cartLineQuantityMax } from "@/shared/constants/cart";
import { formatLabel } from "@/shared/utils/formatLabel";
import { ProductEligibleOffers } from "./ProductEligibleOffers";
import { ProductDeliveryCheck } from "./ProductDeliveryCheck";
import { ProductSizeChartButton } from "./ProductSizeChartButton";
import { ProductRelatedRails } from "./ProductRelatedRails";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import { VARIANT_LOW_STOCK_DEFAULT } from "../constants/productFields";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface VariantSelectionProps {
  attributeGroups: Record<string, string[]>;
  currentPrice: number;
  currentStock: number;
  basePrice: number;
  hasPriceChange: boolean;
  matchedVariant?: ProductVariant | null;
  isAvailable: (key: string, value: string) => boolean;
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
}

interface ProductDetailContentProps {
  product: ProductDetail;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart?: (quantity: number) => void;
  isAddingToCart?: boolean;
  canAddToCart?: boolean;
  needsOptionSelection?: boolean;
  variantUnavailable?: boolean;
  selectedImage: number;
  onSelectImage: (index: number) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  showStickyBar: boolean;
  addSectionRef: RefObject<HTMLDivElement | null>;
  breadcrumbItems: BreadcrumbItem[];
  variantSelection: VariantSelectionProps;
  freeShippingThreshold?: number;
  returnWindowDays?: number | null;
  returnsAllowed?: boolean;
}

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
  const quantityDisabledHint = needsOptionSelection
    ? LABELS.selectAllOptionsHint
    : variantUnavailable
      ? LABELS.variantUnavailableHint
      : !canAddToCart
        ? LABELS.outOfStockHint
        : LABELS.deliveryNotServiceable;
  const reviewCount = product.reviewCount ?? 0;
  const avgRating = product.avgRating ?? 0;
  const formattedPrice = displayPrice.toLocaleString("en-IN");
  const compareAtPrice = product.compareAtPrice ?? null;
  const showMrp = compareAtPrice != null && compareAtPrice > displayPrice;
  const discountPercent = showMrp
    ? Math.round((1 - displayPrice / compareAtPrice) * 100)
    : null;

  const resolvedVariant =
    variantSelection.matchedVariant ??
    (product.variants?.length === 1 ? product.variants[0] : null);

  const galleryImages = (product.images ?? []).filter(
    (image) => !image.variantId || image.variantId === resolvedVariant?.id,
  );
  const selectedGalleryIndex =
    galleryImages.length === 0
      ? 0
      : Math.min(selectedImage, galleryImages.length - 1);
  const lowStockAt = Number(
    resolvedVariant?.lowStockAt ?? VARIANT_LOW_STOCK_DEFAULT,
  );
  const gstPercentage = Number(product.gstPercentage ?? 0);
  const taxInclusiveEstimate =
    gstPercentage > 0
      ? Math.round(displayPrice * (1 + gstPercentage / 100))
      : null;
  const warrantyTypeLabel =
    product.displayWarrantyType === WARRANTY_TYPE.SELLER
      ? LABELS.warrantySeller
      : LABELS.warrantyManufacturer;
  const sellerScore =
    product.vendorPerformanceScore ?? product.vendor?.performanceScore ?? null;

  const categoryName = product.category?.name ?? product.categoryName ?? null;

  const addToCartLabel = needsOptionSelection
    ? LABELS.selectOptions
    : variantUnavailable
      ? LABELS.notAvailable
      : displayStock === 0
        ? LABELS.outOfStock
        : LABELS.addToCart;

  const stickyAddLabel = needsOptionSelection
    ? LABELS.selectOptions
    : variantUnavailable
      ? LABELS.notAvailable
      : formatLabel(LABELS.addToCartWithPrice, { price: formattedPrice });

  const addToCartHint = needsOptionSelection
    ? LABELS.selectOptionsHint
    : variantUnavailable
      ? LABELS.variantUnavailableHint
      : displayStock === 0
        ? LABELS.outOfStockHint
        : deliveryBlocked
          ? LABELS.deliveryNotServiceable
          : isAddingToCart
            ? LABELS.addingToCart
            : "";

  return (
    <div className="storefront-container pb-10 pt-4 sm:pt-6 md:pb-14 md:pt-8">
      <Breadcrumbs items={breadcrumbItems} className="mb-5 sm:mb-6" />

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-10 xl:gap-14">
        <ImageGalleryContainer
          mainImageUrl={galleryImages[0]?.url || product.imageUrl}
          images={galleryImages}
          selectedIndex={selectedGalleryIndex}
          onSelect={onSelectImage}
          productName={product.name}
        />

        <div
          className="min-w-0 md:col-span-6 lg:col-span-5"
          ref={addSectionRef}
        >
          <div className="space-y-5 lg:space-y-6">
            {product.vendor ? (
              <VendorStrip
                vendor={product.vendor}
                size="md"
                rating={sellerScore == null ? undefined : sellerScore}
              />
            ) : null}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.brand ? (
                  <TextEyebrow>{product.brand}</TextEyebrow>
                ) : null}
                {product.category?.name || product.categoryName ? (
                  <TextEyebrow>
                    {product.category?.name ?? product.categoryName}
                  </TextEyebrow>
                ) : null}
              </div>

              <h1
                className="font-display font-semibold leading-[1.15] tracking-tight text-ink"
                style={{ fontSize: "var(--text-display-sm)" }}
              >
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <RatingStars value={avgRating} count={reviewCount} size="md" />
                {reviewCount > 0 ? (
                  <a
                    href="#reviews"
                    className="text-[0.8125rem] text-ink-muted underline-offset-2 hover:text-brand hover:underline"
                    onClick={() => setDetailTab("reviews")}
                  >
                    {formatLabel(LABELS.reviewsWithCount, {
                      count: reviewCount,
                    })}
                  </a>
                ) : null}
              </div>

              {product.tags?.length ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3 border-y border-line py-4">
              <div aria-live="polite" className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-sans text-[1.875rem] font-semibold leading-none text-brand">
                    ₹{formattedPrice}
                  </p>
                  {discountPercent != null && discountPercent > 0 ? (
                    <Badge variant="destructive" className="rounded-full">
                      {formatLabel(LABELS.discountPercentOff, {
                        percent: discountPercent,
                      })}
                    </Badge>
                  ) : null}
                </div>
                {showMrp ? (
                  <p className="text-[0.9375rem] text-ink-faint">
                    <span className="mr-1.5">{LABELS.listPrice}:</span>
                    <span className="line-through">
                      ₹{compareAtPrice.toLocaleString("en-IN")}
                    </span>
                  </p>
                ) : variantSelection.hasPriceChange ? (
                  <p className="text-[0.9375rem] text-ink-faint line-through">
                    ₹{variantSelection.basePrice.toLocaleString("en-IN")}
                  </p>
                ) : null}
                {gstPercentage > 0 ? (
                  <p className="text-[0.8125rem] text-ink-muted">
                    {formatLabel(LABELS.taxExclusiveGst, {
                      percent: gstPercentage,
                    })}
                  </p>
                ) : null}
                {product.displayHsnCode ? (
                  <p className="text-[0.8125rem] text-ink-muted">
                    {formatLabel(LABELS.hsnCodeLabel, {
                      code: product.displayHsnCode,
                    })}
                  </p>
                ) : null}
                {taxInclusiveEstimate != null ? (
                  <p className="text-[0.8125rem] text-ink-faint">
                    {formatLabel(LABELS.taxInclusiveEstimate, {
                      amount: taxInclusiveEstimate.toLocaleString("en-IN"),
                    })}
                  </p>
                ) : null}
                {resolvedVariant?.sku ? (
                  <p className="text-[0.8125rem] text-ink-muted">
                    {LABELS.sku}: {resolvedVariant.sku}
                  </p>
                ) : null}
              </div>
              {needsOptionSelection ? null : displayStock === 0 ||
                variantUnavailable ? (
                <Badge variant="destructive">
                  {variantUnavailable ? LABELS.notAvailable : LABELS.outOfStock}
                </Badge>
              ) : displayStock <= lowStockAt ? (
                <Badge variant="destructive">
                  {formatLabel(LABELS.onlyLeft, { count: displayStock })}
                </Badge>
              ) : (
                <Badge variant="success">{LABELS.inStock}</Badge>
              )}
            </div>

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

            <div className="space-y-3 rounded-xl border border-line bg-paper/50 p-3 sm:p-4">
              {needsOptionSelection ? (
                <p className="text-[0.8125rem] text-ink-muted">
                  {LABELS.selectAllOptionsHint}
                </p>
              ) : variantUnavailable ? (
                <p className="text-[0.8125rem] text-ink-muted">
                  {LABELS.variantUnavailableHint}
                </p>
              ) : !canAddToCart && displayStock === 0 ? (
                <p className="text-[0.8125rem] text-ink-muted">
                  {LABELS.outOfStockHint}
                </p>
              ) : null}

              <ProductDeliveryCheck
                productId={product.id}
                variantId={resolvedVariant?.id}
                vendorId={product.vendor?.id}
                price={displayPrice}
                codAvailable={product.codAvailable}
                codMinOrderValue={product.codMinOrderValue}
                codMaxOrderValue={product.codMaxOrderValue}
                onBlockedChange={setDeliveryBlocked}
              />

              <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3 sm:gap-2.5">
                <QuantitySelector
                  value={quantity}
                  onChange={onQuantityChange}
                  max={Math.max(quantityMax, 1)}
                  disabled={quantityDisabled}
                  disabledHint={quantityDisabledHint}
                  className="shrink-0"
                  controlClassName="h-9 w-9 min-h-9 max-h-9 [&_svg]:size-3.5"
                  valueClassName="h-5 w-6 text-[0.8125rem]"
                />

                <DisabledActionHint
                  disabled={addDisabled}
                  message={addToCartHint}
                  className="min-w-0 flex-1"
                >
                  <Button
                    className="w-full rounded-md sm:min-w-[10rem]"
                    disabled={addDisabled}
                    onClick={() => {
                      if (addDisabled) return;
                      onAddToCart?.(quantity);
                    }}
                    loading={isAddingToCart}
                  >
                    {addToCartLabel}
                  </Button>
                </DisabledActionHint>

                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 rounded-md border-line"
                  onClick={onToggleWishlist}
                  aria-label={
                    isWishlisted
                      ? LABELS.removeFromWishlist
                      : LABELS.addToWishlist
                  }
                >
                  <Heart
                    size={16}
                    className={cn(
                      isWishlisted
                        ? "fill-danger text-danger"
                        : "text-ink-muted",
                      isWishlisted && "animate-pulse-scale",
                    )}
                  />
                </Button>
                <ShareButtonContainer
                  title={product.name}
                  url={PATHS.product(product.slug ?? product.id)}
                />
              </div>
            </div>

            {product.vendor?.slug ? (
              <div className="rounded-lg border border-line bg-surface px-3 py-3">
                <p className="text-[0.8125rem] text-ink-muted">
                  {LABELS.soldBy}{" "}
                  <Link
                    href={PATHS.vendorPage(product.vendor.slug)}
                    className="font-medium text-brand underline-offset-2 hover:underline"
                  >
                    {product.vendor.businessName}
                  </Link>
                </p>
              </div>
            ) : null}

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-3">
                <Truck
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                  strokeWidth={1.75}
                />
                <div className="space-y-1">
                  <p className="text-[0.8125rem] leading-snug text-ink-muted">
                    {typeof freeShippingThreshold === "number"
                      ? formatLabel(LABELS.freeDeliveryAbove, {
                          amount: freeShippingThreshold.toLocaleString("en-IN"),
                        })
                      : LABELS.deliveryAtCheckout}
                  </p>
                  {product.deliveryNote ? (
                    <p className="text-[0.8125rem] leading-snug text-ink-muted">
                      {product.deliveryNote}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-3">
                <RotateCcw
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                  strokeWidth={1.75}
                />
                <div className="space-y-1">
                  <p className="text-[0.8125rem] leading-snug text-ink-muted">
                    {returnsAllowed === false
                      ? LABELS.notReturnable
                      : typeof returnWindowDays === "number"
                        ? formatLabel(LABELS.easyReturnsDays, {
                            days: returnWindowDays,
                          })
                        : LABELS.returnsEligible}
                  </p>
                  {typeof product.returnShippingFee === "number" &&
                  returnsAllowed !== false ? (
                    <p className="text-[0.8125rem] leading-snug text-ink-muted">
                      {product.returnShippingFee > 0
                        ? formatLabel(LABELS.returnShippingFeeAmount, {
                            amount:
                              product.returnShippingFee.toLocaleString("en-IN"),
                          })
                        : LABELS.returnShippingFree}
                    </p>
                  ) : null}
                  {product.returnNote ? (
                    <p className="text-[0.8125rem] leading-snug text-ink-muted">
                      {product.returnNote}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {product.displayWarrantyMonths ? (
              <div className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-3">
                <Shield
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                  strokeWidth={1.75}
                />
                <p className="text-[0.8125rem] leading-snug text-ink-muted">
                  {formatLabel(LABELS.warrantyMonthsLabel, {
                    months: product.displayWarrantyMonths,
                    type: warrantyTypeLabel,
                  })}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-line pt-8 md:mt-16 md:pt-10">
        <Tabs value={detailTab} onValueChange={setDetailTab}>
          <TabsList className="w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-line bg-transparent p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {LABELS.description}
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {LABELS.specifications}
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {formatLabel(LABELS.reviewsWithCount, { count: reviewCount })}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6 md:py-8">
            <div className="max-w-3xl space-y-8">
              <ProductInfo product={product} />
              {product.videoUrl ? (
                <div className="space-y-2">
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                    {LABELS.productVideo}
                  </p>
                  <video
                    src={product.videoUrl}
                    controls
                    className="w-full rounded-xl border border-line bg-paper"
                    aria-label={LABELS.productVideo}
                  />
                </div>
              ) : null}
              {product.highlights?.length ? (
                <ProductHighlights highlights={product.highlights} />
              ) : null}
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6 md:py-8">
            <ProductSpecifications
              specs={product.specs}
              matchedVariant={resolvedVariant}
              categoryName={categoryName}
              secondaryCategories={product.secondaryCategories}
              displayStock={displayStock}
            />
          </TabsContent>
          <TabsContent value="reviews" className="py-6 md:py-8" id="reviews">
            <ProductReviewsContainer
              productId={product.id}
              enabled={detailTab === "reviews"}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProductRelatedRails
        productId={product.id}
        categoryId={product.categoryId}
        vendorId={product.vendor?.id}
      />

      {showStickyBar &&
      (displayStock > 0 || needsOptionSelection || variantUnavailable) ? (
        <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-line bg-surface/95 p-3 shadow-elevation-3 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8125rem] font-medium text-ink">
                {product.name}
              </p>
              <p className="text-[0.9375rem] font-semibold text-brand">
                ₹{formattedPrice}
              </p>
            </div>
            <DisabledActionHint
              disabled={addDisabled}
              message={addToCartHint}
              className="shrink-0"
            >
              <Button
                size="lg"
                className="rounded-full px-5"
                disabled={addDisabled}
                onClick={() => {
                  if (addDisabled) return;
                  onAddToCart?.(quantity);
                }}
                loading={isAddingToCart}
              >
                {stickyAddLabel}
              </Button>
            </DisabledActionHint>
          </div>
        </div>
      ) : null}
    </div>
  );
}
