"use client";

import { Button } from "@/shared/components/ui/button";
import { QuantitySelector } from "@/shared/components/QuantitySelector.component";
import { ShareButtonContainer } from "@/shared/containers/ShareButtonContainer.container";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { ProductDeliveryCheck } from "../ProductDeliveryCheck.component";
import { Heart } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { NotifyMeButton } from "@/features/stockAlerts";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "./productDetailContent.styles";

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
  addToCartHint: string;
  addToCartLabel: string;
  isAddingToCart?: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart?: (quantity: number) => void;
  productName: string;
  productUrl: string;
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
  addToCartHint,
  addToCartLabel,
  isAddingToCart,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  productName,
  productUrl,
}: PurchasePanelProps) {
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
      ) : !canAddToCart && displayStock === 0 ? (
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.outOfStockStack}>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.helperText}>
            {LABELS.outOfStockHint}
          </p>
          <NotifyMeButton variantId={variantId ?? null} />
        </div>
      ) : null}

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

      <div className={PRODUCT_DETAIL_CONTENT_STYLES.actionRow}>
        <QuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          max={Math.max(quantityMax, 1)}
          disabled={quantityDisabled}
          disabledHint={quantityDisabledHint}
          className={PRODUCT_DETAIL_CONTENT_STYLES.quantitySelector}
          controlClassName={PRODUCT_DETAIL_CONTENT_STYLES.quantityControl}
          valueClassName={PRODUCT_DETAIL_CONTENT_STYLES.quantityValue}
        />

        <DisabledActionHint
          disabled={addDisabled}
          message={addToCartHint}
          className={PRODUCT_DETAIL_CONTENT_STYLES.addToCartWrapper}
        >
          <Button
            className={PRODUCT_DETAIL_CONTENT_STYLES.addToCartButton}
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
        <ShareButtonContainer title={productName} url={productUrl} />
      </div>
    </div>
  );
}
