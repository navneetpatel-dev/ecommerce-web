"use client";

import { Button } from "@/shared/components/ui/button";
import { QuantitySelector } from "@/shared/components/QuantitySelector";
import { ShareButtonContainer } from "@/shared/containers/ShareButtonContainer";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import { ProductDeliveryCheck } from "../ProductDeliveryCheck";
import { Heart } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";

interface PurchasePanelProps {
  productId: string;
  variantId: string | undefined;
  vendorId: string | undefined;
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  canAddToCart: boolean;
  displayStock: number;
  displayPrice: number;
  codAvailable?: boolean;
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
  displayPrice,
  codAvailable,
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
        productId={productId}
        variantId={variantId}
        vendorId={vendorId}
        price={displayPrice}
        codAvailable={codAvailable}
        codMinOrderValue={codMinOrderValue}
        codMaxOrderValue={codMaxOrderValue}
        onBlockedChange={onDeliveryBlockedChange}
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
            isWishlisted ? LABELS.removeFromWishlist : LABELS.addToWishlist
          }
        >
          <Heart
            size={16}
            className={cn(
              isWishlisted ? "fill-danger text-danger" : "text-ink-muted",
              isWishlisted && "animate-pulse-scale",
            )}
          />
        </Button>
        <ShareButtonContainer title={productName} url={productUrl} />
      </div>
    </div>
  );
}
