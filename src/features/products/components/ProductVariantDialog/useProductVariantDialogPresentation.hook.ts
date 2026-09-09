import { useRef, useCallback } from "react";
import { useProduct } from "../../api/products.queries";
import { useVariantSelection } from "../../hooks/useVariantSelection.hook";

interface UseProductVariantDialogPresentationProps {
  open: boolean;
  productSlug: string;
  onConfirm: (variantId: string) => void;
}

export function useProductVariantDialogPresentation({
  open,
  productSlug,
  onConfirm,
}: UseProductVariantDialogPresentationProps) {
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

  const handleOpenAutoFocus = useCallback((event: Event) => {
    event.preventDefault();
    titleRef.current?.focus();
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selection.variantId) return;
    onConfirm(selection.variantId);
  }, [onConfirm, selection.variantId]);

  return {
    titleRef,
    product,
    isLoading,
    selection,
    canAdd,
    handleOpenAutoFocus,
    handleConfirm,
  };
}
