import type { ProductVariant } from "@/shared/api/types";

function variantIsInStock(variant: ProductVariant): boolean {
  return Number(variant.stock) > 0;
}

function variantHasMatrixAttributes(
  variant: ProductVariant,
  matrixKeys: string[],
): boolean {
  return matrixKeys.every((key) => {
    const value = variant.attributes[key];
    return value != null && value !== "";
  });
}

function getVariantSchemaSignature(variant: ProductVariant): string {
  return Object.keys(variant.attributes)
    .filter((key) => {
      const value = variant.attributes[key];
      return value != null && value !== "";
    })
    .sort()
    .join("|");
}

export function getMatrixVariants(
  variants: ProductVariant[],
  matrixKeys: string[],
): ProductVariant[] {
  if (!matrixKeys.length) return variants;
  return variants.filter((variant) =>
    variantHasMatrixAttributes(variant, matrixKeys),
  );
}

/**
 * Picks the dominant variant schema (e.g. Storage × Color), preferring groups
 * with in-stock variants — handles mixed legacy + matrix variant rows.
 */
export function getMatrixAttributeKeys(variants: ProductVariant[]): string[] {
  if (!variants.length) return [];

  const groups = new Map<string, ProductVariant[]>();
  for (const variant of variants) {
    const signature = getVariantSchemaSignature(variant);
    if (!signature) continue;
    const bucket = groups.get(signature) ?? [];
    bucket.push(variant);
    groups.set(signature, bucket);
  }

  if (!groups.size) return [];

  let bestKeys: string[] = [];
  let bestScore = -1;

  for (const [signature, group] of groups) {
    const inStockCount = group.filter(variantIsInStock).length;
    const score = inStockCount * 100_000 + group.length;
    if (score > bestScore) {
      bestScore = score;
      bestKeys = signature.split("|");
    }
  }

  return bestKeys;
}

export function groupVariantAttributes(variants: ProductVariant[]) {
  const matrixKeys = getMatrixAttributeKeys(variants);
  if (!matrixKeys.length) return {};

  const groups: Record<string, string[]> = {};
  for (const variant of getMatrixVariants(variants, matrixKeys)) {
    for (const key of matrixKeys) {
      const val = variant.attributes[key];
      if (!groups[key]) groups[key] = [];
      if (!groups[key].includes(val)) groups[key].push(val);
    }
  }
  return groups;
}

/** Default PDP selection: first in-stock full matrix combo, or nothing if all OOS. */
export function resolveDefaultVariantSelection(
  variants: ProductVariant[],
): Record<string, string> {
  if (!variants.length) return {};

  const matrixKeys = getMatrixAttributeKeys(variants);
  const matrixVariants = getMatrixVariants(variants, matrixKeys);

  if (!matrixKeys.length) {
    const inStock = variants.filter(variantIsInStock);
    if (inStock.length === 1) return { ...inStock[0].attributes };
    if (variants.length === 1 && variantIsInStock(variants[0])) {
      return { ...variants[0].attributes };
    }
    return {};
  }

  const inStockMatch = matrixVariants.find((variant) =>
    variantIsInStock(variant),
  );

  if (!inStockMatch) return {};
  return { ...inStockMatch.attributes };
}

function hasFullAttributeSelection(
  selected: Record<string, string>,
  attributeKeys: string[],
): boolean {
  if (!attributeKeys.length) return false;
  return attributeKeys.every((key) => {
    const value = selected[key];
    return value != null && value !== "";
  });
}

export function findMatchingVariant(
  variants: ProductVariant[],
  selected: Record<string, string>,
): ProductVariant | null {
  if (!variants.length) return null;

  if (variants.length === 1 && Object.keys(selected).length === 0) {
    return variantIsInStock(variants[0]) ? variants[0] : null;
  }

  const selectedEntries = Object.entries(selected).filter(
    ([, value]) => value != null && value !== "",
  );
  if (!selectedEntries.length) return null;

  const attributeKeys = getMatrixAttributeKeys(variants);
  if (!attributeKeys.length) {
    const inStock = variants.filter(variantIsInStock);
    if (inStock.length === 1) return inStock[0];
    return null;
  }

  if (!hasFullAttributeSelection(selected, attributeKeys)) return null;

  const matrixVariants = getMatrixVariants(variants, attributeKeys);
  const match = matrixVariants.find((variant) =>
    selectedEntries.every(([key, value]) => variant.attributes[key] === value),
  );

  if (!match || !variantIsInStock(match)) return null;
  return match;
}

export function isVariantCombinationAvailable(
  variants: ProductVariant[],
  selected: Record<string, string>,
  key: string,
  value: string,
): boolean {
  const matrixKeys = getMatrixAttributeKeys(variants);
  const testSelection = { ...selected, [key]: value };
  const matrixVariants = getMatrixVariants(variants, matrixKeys);

  return matrixVariants.some((variant) => {
    if (!variantIsInStock(variant)) return false;
    if (!variantHasMatrixAttributes(variant, matrixKeys)) return false;

    return matrixKeys.every((attrKey) => {
      const chosen = testSelection[attrKey];
      if (chosen == null || chosen === "") return true;
      return variant.attributes[attrKey] === chosen;
    });
  });
}

/**
 * The variant a selection points at, regardless of stock.
 *
 * `findMatchingVariant` deliberately returns null for an out-of-stock match so
 * callers cannot add it to the cart. Price display needs the opposite: showing
 * `basePrice` for a sold-out variant quotes a number the shopper cannot buy at,
 * and on products whose variants differ in price it is simply the wrong figure.
 */
export function findSelectedVariant(
  variants: ProductVariant[],
  selected: Record<string, string>,
): ProductVariant | null {
  const matrixKeys = getMatrixAttributeKeys(variants);
  if (!matrixKeys.length || !hasFullAttributeSelection(selected, matrixKeys)) {
    return null;
  }

  return (
    getMatrixVariants(variants, matrixKeys).find((variant) =>
      matrixKeys.every((key) => variant.attributes[key] === selected[key]),
    ) ?? null
  );
}
