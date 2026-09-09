"use client";

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
import { VariantSelector } from "../VariantSelector.component";
import { productVariantDialogStyles } from "../../../styles/variants/productVariantDialog.styles";
import { useProductVariantDialogPresentation } from "../../../hooks/variants/useProductVariantDialogPresentation.hook";

export interface ProductVariantDialogProps {
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
  const {
    titleRef,
    product,
    isLoading,
    selection,
    canAdd,
    handleOpenAutoFocus,
    handleConfirm,
  } = useProductVariantDialogPresentation({
    open,
    productSlug,
    onConfirm,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={productVariantDialogStyles.dialogContent}
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <DialogHeader>
          <DialogTitle ref={titleRef} tabIndex={-1}>
            {LABELS.selectOptions}
          </DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className={productVariantDialogStyles.loaderWrapper}>
            <span className={productVariantDialogStyles.spinner} />
            <span className={productVariantDialogStyles.srOnly}>
              {LABELS.loading}
            </span>
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
          <p className={productVariantDialogStyles.emptyText}>
            {LABELS.couldNotLoadProduct}
          </p>
        )}

        {product ? (
          <DialogFooter>
            <Button
              className={productVariantDialogStyles.confirmButton}
              disabled={!canAdd}
              loading={isAddingToCart}
              onClick={handleConfirm}
            >
              {LABELS.addToCart}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
