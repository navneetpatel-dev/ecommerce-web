"use client";

import { useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { useProduct } from "../api/products.queries";
import { useVariantSelection } from "../hooks/useVariantSelection.hook";
import { VariantSelector } from "./VariantSelector.component";

interface ProductVariantDialogProps {
  open: boolean;
  productName: string;
  productSlug: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (variantId: string) => void;
  isAddingToCart: boolean;
}

export function ProductVariantDialog({
  open,
  productName,
  productSlug,
  onOpenChange,
  onConfirm,
  isAddingToCart,
}: ProductVariantDialogProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { data: product, isLoading } = useProduct(productSlug, {
    enabled: open,
  });
  const selection = useVariantSelection(
    product?.variants ?? [],
    product?.basePrice ?? 0,
    product?.stock ?? 0,
  );
  const canAdd =
    selection.hasCompleteSelection &&
    Boolean(selection.variantId) &&
    selection.currentStock > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(42rem,calc(100dvh-2rem))] sm:max-w-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          titleRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle ref={titleRef} tabIndex={-1}>
            {LABELS.selectOptions}
          </DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-32 items-center justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <span className="sr-only">{LABELS.loading}</span>
          </div>
        ) : product ? (
          <VariantSelector
            attributeGroups={selection.attributeGroups}
            currentPrice={selection.currentPrice}
            currentStock={selection.currentStock}
            basePrice={product.basePrice}
            hasPriceChange={selection.hasPriceChange}
            isAvailable={selection.isAvailable}
            isActive={selection.isActive}
            onSelectValue={selection.selectValue}
          />
        ) : (
          <p className="py-8 text-center text-body-sm text-ink-muted">
            {LABELS.couldNotLoadProduct}
          </p>
        )}

        {product ? (
          <DialogFooter>
            <Button
              className="w-full sm:w-auto"
              disabled={!canAdd}
              loading={isAddingToCart}
              onClick={() => {
                if (!selection.variantId) return;
                onConfirm(selection.variantId);
              }}
            >
              {LABELS.addToCart}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
