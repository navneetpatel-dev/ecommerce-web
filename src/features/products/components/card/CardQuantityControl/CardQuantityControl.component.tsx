"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatedQuantityValue } from "@/shared/components/AnimatedQuantityValue.component";
import { Button } from "@/shared/components/ui/button";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart/cart";
import { LABELS } from "@/shared/constants/labels";
import { cardQuantityControlStyles } from "../../../styles/card/cardQuantityControl.styles";
import { useCardQuantityControlHandlers } from "../../../hooks/card/useCardQuantityControlHandlers.hook";

export interface CardQuantityControlProps {
  value: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  className?: string;
}

export function CardQuantityControl({
  value,
  max = MAX_CART_LINE_QUANTITY,
  disabled = false,
  onChange,
  className,
}: CardQuantityControlProps) {
  const { atMax, handleContainerClick, handleDecrease, handleIncrease } =
    useCardQuantityControlHandlers({
      value,
      max,
      disabled,
      onChange,
    });

  return (
    <div
      className={cardQuantityControlStyles.root(className)}
      onClick={handleContainerClick}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || value <= 0}
        aria-label={LABELS.decreaseQuantity}
        className={cardQuantityControlStyles.controlButton}
        onClick={handleDecrease}
      >
        <Minus size={16} strokeWidth={2.25} />
      </Button>

      <AnimatedQuantityValue
        value={value}
        className={cardQuantityControlStyles.animatedWrapper}
        digitClassName={cardQuantityControlStyles.animatedDigit}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || atMax}
        aria-label={LABELS.increaseQuantity}
        className={cardQuantityControlStyles.controlButton}
        onClick={handleIncrease}
      >
        <Plus size={16} strokeWidth={2.25} />
      </Button>
    </div>
  );
}
