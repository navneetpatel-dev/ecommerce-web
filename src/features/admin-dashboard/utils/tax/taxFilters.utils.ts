export interface FilterableTaxRule {
  hsnCode?: string | null;
  categoryName?: string | null;
  gstPercentage?: number | string | null;
  priceBandThreshold?: number | string | null;
}

export function filterTaxRules<T extends FilterableTaxRule>(
  items: T[],
  search: string,
  gstTier: string,
  hasPriceBand: string,
): T[] {
  const q = search.trim().toLowerCase();
  return items.filter((item) => {
    if (q) {
      const hsn = String(item.hsnCode ?? "").toLowerCase();
      const cat = String(item.categoryName ?? "").toLowerCase();
      const gst = String(item.gstPercentage ?? "");
      if (!hsn.includes(q) && !cat.includes(q) && !gst.includes(q)) {
        return false;
      }
    }
    if (gstTier && Number(item.gstPercentage) !== Number(gstTier)) {
      return false;
    }
    const hasBand = item.priceBandThreshold != null;
    if (hasPriceBand === "YES" && !hasBand) return false;
    if (hasPriceBand === "NO" && hasBand) return false;
    return true;
  });
}
