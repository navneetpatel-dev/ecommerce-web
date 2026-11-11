import type { ProductVariant } from "@/shared/api/types";
import {
  findSelectedVariant,
  getMatrixAttributeKeys,
  getMatrixVariants,
  resolveDefaultVariantSelection,
} from "./index";

function variantIsInStock(variant: ProductVariant): boolean {
  return Number(variant.stock) > 0;
}

function countKeptChoices(
  variant: ProductVariant,
  current: Record<string, string>,
  matrixKeys: string[],
  changedKey: string,
): number {
  return matrixKeys.filter(
    (key) =>
      key !== changedKey &&
      current[key] != null &&
      variant.attributes[key] === current[key],
  ).length;
}

/**
 * The selection a click on `key = value` lands on. Every option stays clickable:
 * if the current choices combine with it, that variant (even sold out, so the
 * shopper can ask to be told when it is back); otherwise the variant with this
 * value that keeps the most current choices, in-stock ones first.
 */
export function resolveSelectionForOption(
  variants: ProductVariant[],
  current: Record<string, string>,
  key: string,
  value: string,
): Record<string, string> {
  const matrixKeys = getMatrixAttributeKeys(variants);
  const candidates = getMatrixVariants(variants, matrixKeys).filter(
    (variant) => variant.attributes[key] === value,
  );
  if (!candidates.length) return { ...current, [key]: value };

  const exact = candidates.find((variant) =>
    matrixKeys.every(
      (attrKey) =>
        attrKey === key || variant.attributes[attrKey] === current[attrKey],
    ),
  );
  if (exact) return { ...exact.attributes };

  const ranked = candidates
    .map((variant, index) => ({
      variant,
      index,
      inStock: variantIsInStock(variant) ? 1 : 0,
      kept: countKeptChoices(variant, current, matrixKeys, key),
    }))
    .sort(
      (a, b) => b.inStock - a.inStock || b.kept - a.kept || a.index - b.index,
    );
  return { ...ranked[0].variant.attributes };
}

/** True when the variant a click on this option lands on is in stock. */
export function isOptionInStock(
  variants: ProductVariant[],
  current: Record<string, string>,
  key: string,
  value: string,
): boolean {
  const landing = findSelectedVariant(
    variants,
    resolveSelectionForOption(variants, current, key, value),
  );
  return landing ? variantIsInStock(landing) : false;
}

/** The other groups whose choice changes when this option is picked. */
export function changedGroupsForOption(
  variants: ProductVariant[],
  current: Record<string, string>,
  key: string,
  value: string,
): string[] {
  const next = resolveSelectionForOption(variants, current, key, value);
  return getMatrixAttributeKeys(variants).filter(
    (attrKey) =>
      attrKey !== key &&
      current[attrKey] != null &&
      next[attrKey] !== current[attrKey],
  );
}

/** Initial selection: the variant named in the URL, else the first in stock, else the first. */
export function resolveInitialVariantSelection(
  variants: ProductVariant[],
  preferredVariantId?: string | null,
): Record<string, string> {
  const matrixKeys = getMatrixAttributeKeys(variants);
  const preferred = preferredVariantId
    ? getMatrixVariants(variants, matrixKeys).find(
        (variant) => variant.id === preferredVariantId,
      )
    : undefined;
  if (preferred && matrixKeys.length) return { ...preferred.attributes };

  const inStockDefault = resolveDefaultVariantSelection(variants);
  if (Object.keys(inStockDefault).length || !matrixKeys.length) {
    return inStockDefault;
  }
  // Fully sold out: select a real variant so the page can say "Out of stock"
  // and offer Notify me, instead of asking for options that cannot be bought.
  const first = getMatrixVariants(variants, matrixKeys)[0];
  return first ? { ...first.attributes } : {};
}
