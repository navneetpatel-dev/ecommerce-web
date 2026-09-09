"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CardQuantityControl } from "../CardQuantityControl.component";
import { cn } from "@/shared/utils/dom/cn";
import { PRODUCT_CARD_STYLES } from "../../../styles/card/productCard.styles";

const controlMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.2, 0, 0, 1] as const },
};

interface CardControlsProps {
  variant: "overlay" | "mobile";
  inCart: boolean;
  isAddingToCart: boolean;
  cartQuantity: number;
  maxQuantity: number;
  quickAddLabel: string;
  onAddToCart?: () => void;
  onQuantityChange?: (quantity: number) => void;
}

export function CardControls({
  variant,
  inCart,
  isAddingToCart,
  cartQuantity,
  maxQuantity,
  quickAddLabel,
  onAddToCart,
  onQuantityChange,
}: CardControlsProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {inCart ? (
        <motion.div
          key="qty"
          className={PRODUCT_CARD_STYLES.controlMotionDiv}
          {...controlMotion}
        >
          <CardQuantityControl
            value={cartQuantity}
            max={maxQuantity}
            onChange={(qty) => onQuantityChange?.(qty)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="add"
          className={PRODUCT_CARD_STYLES.controlMotionDiv}
          {...controlMotion}
        >
          <Button
            size="sm"
            variant={variant === "mobile" ? "secondary" : "default"}
            className={cn(
              PRODUCT_CARD_STYLES.controlButtonBase,
              variant === "overlay" && PRODUCT_CARD_STYLES.controlButtonOverlay,
            )}
            disabled={isAddingToCart}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.();
            }}
          >
            {isAddingToCart && !inCart ? (
              <span className={PRODUCT_CARD_STYLES.spinner} />
            ) : (
              <>
                <Plus size={16} />
                {quickAddLabel}
              </>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
