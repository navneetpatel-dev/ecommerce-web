import { useState, useMemo } from "react";
import type { ProductVariant } from "@/shared/api/types";
import {
  findMatchingVariant,
  findSelectedVariant,
  getMatrixAttributeKeys,
  getMatrixVariants,
  groupVariantAttributes,
  isVariantCombinationAvailable,
  resolveDefaultVariantSelection,
} from "../utils/products.utils";

function isSameSelection(a: Record<string, string>, b: Record<string, string>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

export function useVariantSelection(
  variants: ProductVariant[],
  basePrice: number,
  baseStock: number,
) {
  const variantKey = useMemo(
    () => variants.map((variant) => variant.id).join("|"),
    [variants],
  );
  const [selectionState, setSelectionState] = useState(() => ({
    key: variantKey,
    selected: resolveDefaultVariantSelection(variants),
  }));

  let selected = selectionState.selected;
  if (selectionState.key !== variantKey) {
    const next = resolveDefaultVariantSelection(variants);
    selected = next;
    setSelectionState({ key: variantKey, selected: next });
  }

  const matchedVariant = useMemo(
    () => findMatchingVariant(variants, selected),
    [variants, selected],
  );

  const attributeGroups = useMemo(
    () => groupVariantAttributes(variants),
    [variants],
  );

  const selectValue = (key: string, value: string) => {
    setSelectionState((prev) => {
      const current = prev.key === variantKey ? prev.selected : selected;
      const next = { ...current, [key]: value };
      const resolved = (() => {
        if (findMatchingVariant(variants, next)) return next;

        const matrixKeys = getMatrixAttributeKeys(variants);
        const matrixVariants = getMatrixVariants(variants, matrixKeys);
        const inStockMatch = matrixVariants.find(
          (variant) =>
            Number(variant.stock) > 0 && variant.attributes[key] === value,
        );

        if (inStockMatch) return { ...inStockMatch.attributes };
        return next;
      })();

      if (prev.key === variantKey && isSameSelection(prev.selected, resolved)) {
        return prev;
      }
      return { key: variantKey, selected: resolved };
    });
  };

  const isAvailable = (key: string, value: string) =>
    isVariantCombinationAvailable(variants, selected, key, value);

  const isActive = (key: string, value: string) => selected[key] === value;

  const hasCompleteSelection =
    Object.keys(attributeGroups).length === 0 ||
    Object.keys(attributeGroups).every((key) => Boolean(selected[key]));

  /**
   * Price follows the selection even when that variant is sold out — otherwise a
   * sold-out option silently shows basePrice, which is a different amount on any
   * product whose variants are priced differently.
   */
  const selectedVariant = useMemo(
    () => matchedVariant ?? findSelectedVariant(variants, selected),
    [matchedVariant, variants, selected],
  );

  const currentPrice = selectedVariant?.price ?? basePrice;
  const currentStock =
    matchedVariant?.stock ?? (variants.length === 1 ? baseStock : 0);
  const variantId = matchedVariant?.id ?? null;

  return {
    attributeGroups,
    currentPrice,
    currentStock,
    variantId,
    matchedVariant,
    isAvailable,
    isActive,
    selectValue,
    hasCompleteSelection,
    hasPriceChange:
      selectedVariant?.price !== undefined &&
      selectedVariant.price !== basePrice,
  };
}
