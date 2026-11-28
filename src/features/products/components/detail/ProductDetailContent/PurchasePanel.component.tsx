"use client";

import { Button } from "@/shared/components/ui/button";
import { ShareButtonContainer } from "@/shared/containers/system/ShareButtonContainer.container";
import { ProductDeliveryCheck } from "../../delivery-check/ProductDeliveryCheck.component";
import { Heart } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { NotifyMeButton } from "@/features/stockAlerts";
import { PurchaseActions } from "./PurchaseActions.component";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "../../../styles/detail/productDetailContent.styles";

interface PurchasePanelProps {
  productId: string;
  variantId: string | undefined;
  vendorId: string | undefined;
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  canAddToCart: boolean;
  displayStock: number;
  codAvailable?: boolean;
  codEligibleAtUnitPrice?: boolean;
  codMinOrderValue?: number;
  codMaxOrderValue?: number | null;
  onDeliveryBlockedChange: (blocked: boolean) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  quantityMax: number;
  quantityDisabled: boolean;
  quantityDisabledHint: string;
  addDisabled: boolean;
  /** Nothing left of the chosen variant: hide quantity and Add, show Notify me. */
  isSoldOut: boolean;
  /** The chosen variant is priced above its MRP: it cannot be bought, in stock or not. */
  offSale?: boolean;
  addToCartHint: string;
  addToCartLabel: string;
  isAddingToCart?: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart?: (quantity: number) => void;
  productName: string;
  productUrl: string;
  imageUrl?: string;
  price?: number;
  description?: string;
  /** Nothing here talks to the server for a product that is not on sale: no delivery check, notify-me, wishlist or share. */
  preview?: boolean;
}

export function PurchasePanel({
  productId,
  variantId,
  vendorId,
  needsOptionSelection,
  variantUnavailable,
  canAddToCart,
  displayStock,
  codAvailable,
  codEligibleAtUnitPrice,
  codMinOrderValue,
  codMaxOrderValue,
  onDeliveryBlockedChange,
  quantity,
  onQuantityChange,
  quantityMax,
  quantityDisabled,
  quantityDisabledHint,
  addDisabled,
  isSoldOut,
  offSale = false,
  addToCartHint,
  addToCartLabel,
  isAddingToCart,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  productName,
  productUrl,
  imageUrl,
  price,
  description,
  preview = false,
}: PurchasePanelProps) {
  const actionsQuantityMax = Math.max(quantityMax, 1);
  const handleAddToCartClick = () => {
    if (addDisabled) return;
    onAddToCart?.(quantity);
  };

  return (
    <div className={PRODUCT_DETAIL_CONTENT_STYLES.purchasePanelRoot}>
      {needsOptionSelection ? (
        <p className={PRODUCT_DETAIL_CONTENT_STYLES.helperText}>
          {LABELS.selectAllOptionsHint}
        </p>
      ) : variantUnavailable ? (
        <p className={PRODUCT_DETAIL_CONTENT_STYLES.helperText}>
          {LABELS.variantUnavailableHint}
        </p>
      ) : offSale ? (
        <p className={PRODUCT_DETAIL_CONTENT_STYLES.helperText}>
          {LABELS.variantNotOnSaleHint}
        </p>
      ) : isSoldOut || (!canAddToCart && displayStock === 0) ? (
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.outOfStockStack}>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.helperText}>
            {LABELS.outOfStockHint}
          </p>
          {preview ? null : <NotifyMeButton variantId={variantId ?? null} />}
        </div>
      ) : null}

      {preview ? null : (
        <ProductDeliveryCheck
          productId={productId}
          variantId={variantId}
          vendorId={vendorId}
          codAvailable={codAvailable}
          codEligibleAtUnitPrice={codEligibleAtUnitPrice}
          codMinOrderValue={codMinOrderValue}
          codMaxOrderValue={codMaxOrderValue}
          onBlockedChange={onDeliveryBlockedChange}
        />
      )}

      <div className={PRODUCT_DETAIL_CONTENT_STYLES.actionRow}>
        {isSoldOut || offSale ? null : (
          <PurchaseActions
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            quantityMax={actionsQuantityMax}
            quantityDisabled={quantityDisabled}
            quantityDisabledHint={quantityDisabledHint}
            addDisabled={addDisabled}
            addToCartHint={addToCartHint}
            addToCartLabel={addToCartLabel}
            isAddingToCart={isAddingToCart}
            onAddToCart={handleAddToCartClick}
          />
        )}
        {preview ? null : (
          <>
            <Button
              variant="outline"
              size="icon"
              className={PRODUCT_DETAIL_CONTENT_STYLES.wishlistButton}
              onClick={onToggleWishlist}
              aria-label={
                isWishlisted ? LABELS.removeFromWishlist : LABELS.addToWishlist
              }
            >
              <Heart
                size={16}
                className={
                  isWishlisted
                    ? PRODUCT_DETAIL_CONTENT_STYLES.heartWishlisted
                    : PRODUCT_DETAIL_CONTENT_STYLES.heartUnwishlisted
                }
              />
            </Button>
            <ShareButtonContainer
              productId={productId}
              title={productName}
              url={productUrl}
              imageUrl={imageUrl}
              price={price}
              description={description}
            />
          </>
        )}
      </div>
    </div>
  );
}
