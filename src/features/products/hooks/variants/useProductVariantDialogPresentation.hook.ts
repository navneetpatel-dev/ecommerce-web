import { useRef, useCallback, useMemo } from "react";
import {
  customerPrice,
  withCustomerPrices,
} from "@/shared/utils/pricing/customerPrice";
import { useProduct } from "../../api/listing/products.queries";
import { useVariantSelection } from "./useVariantSelection.hook";

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

  // Prices shown are what the customer pays, GST included.
  const variants = useMemo(
    () => withCustomerPrices(product?.variants ?? []),
    [product?.variants],
  );
  const listedPrice = product ? customerPrice(product) : 0;
  const selection = useVariantSelection(
    variants,
    listedPrice,
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
    listedPrice,
    isLoading,
    selection,
    canAdd,
    handleOpenAutoFocus,
    handleConfirm,
  };
}
