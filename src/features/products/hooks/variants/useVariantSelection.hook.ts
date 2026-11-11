import { useState, useMemo } from "react";
import type { ProductVariant } from "@/shared/api/types";
import {
  changedGroupsForOption,
  findMatchingVariant,
  findSelectedVariant,
  groupVariantAttributes,
  isOptionInStock,
  resolveInitialVariantSelection,
  resolveSelectionForOption,
} from "../../utils/variants/products.utils";

function isSameSelection(a: Record<string, string>, b: Record<string, string>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

interface VariantSelectionOptions {
  /** A variant to start on (the PDP passes the one named in its URL). */
  initialVariantId?: string | null;
}

export function useVariantSelection(
  variants: ProductVariant[],
  basePrice: number,
  baseStock: number,
  { initialVariantId }: VariantSelectionOptions = {},
) {
  const variantKey = useMemo(
    () => variants.map((variant) => variant.id).join("|"),
    [variants],
  );
  const [selectionState, setSelectionState] = useState(() => ({
    key: variantKey,
    selected: resolveInitialVariantSelection(variants, initialVariantId),
  }));

  let selected = selectionState.selected;
  if (selectionState.key !== variantKey) {
    const next = resolveInitialVariantSelection(variants, initialVariantId);
    selected = next;
    setSelectionState({ key: variantKey, selected: next });
  }

  /** The in-stock variant the selection points at (what can go in the cart). */
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
      const resolved = resolveSelectionForOption(variants, current, key, value);
      if (prev.key === variantKey && isSameSelection(prev.selected, resolved)) {
        return prev;
      }
      return { key: variantKey, selected: resolved };
    });
  };

  /** False only styles the option as sold out; every option stays clickable. */
  const isAvailable = (key: string, value: string) =>
    isOptionInStock(variants, selected, key, value);

  const changesOtherChoices = (key: string, value: string) =>
    changedGroupsForOption(variants, selected, key, value);

  const isActive = (key: string, value: string) => selected[key] === value;

  const hasCompleteSelection =
    Object.keys(attributeGroups).length === 0 ||
    Object.keys(attributeGroups).every((key) => Boolean(selected[key]));

  /**
   * The variant the selection points at, in stock or not. Price and stock follow
   * it, so a sold-out choice shows its own price and "Out of stock" rather than
   * the product's figures.
   */
  const selectedVariant = useMemo(
    () => matchedVariant ?? findSelectedVariant(variants, selected),
    [matchedVariant, variants, selected],
  );

  const currentPrice = selectedVariant?.price ?? basePrice;
  const currentStock = selectedVariant
    ? Number(selectedVariant.stock ?? 0)
    : variants.length === 1
      ? baseStock
      : 0;
  const variantId = matchedVariant?.id ?? null;
  const soldOutVariant =
    selectedVariant && !matchedVariant ? selectedVariant : null;

  return {
    attributeGroups,
    currentPrice,
    currentStock,
    variantId,
    matchedVariant,
    selectedVariant,
    soldOutVariant,
    isAvailable,
    changesOtherChoices,
    isActive,
    selectValue,
    hasCompleteSelection,
    hasPriceChange:
      selectedVariant?.price !== undefined &&
      selectedVariant.price !== basePrice,
  };
}
