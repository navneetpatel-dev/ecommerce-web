"use client";

import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";

interface StickyAddToCartBarProps {
  visible: boolean;
  productName: string;
  formattedPrice: string;
  addDisabled: boolean;
  addToCartHint: string;
  addLabel: string;
  isAddingToCart?: boolean;
  quantity: number;
  onAddToCart?: (quantity: number) => void;
}

export function StickyAddToCartBar({
  visible,
  productName,
  formattedPrice,
  addDisabled,
  addToCartHint,
  addLabel,
  isAddingToCart,
  quantity,
  onAddToCart,
}: StickyAddToCartBarProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-line bg-surface/95 p-3 shadow-elevation-3 backdrop-blur-sm md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-medium text-ink">
            {productName}
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
            {addLabel}
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  );
}
