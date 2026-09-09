"use client";

import type { ProductListItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { MAX_COMPARED_PRODUCTS } from "../../../constants/compare/compare";
import { productCompareBarStyles } from "../../../styles/compare/productCompareBar.styles";
import { ProductCompareTagsList } from "./ProductCompareTagsList.component";

export interface ProductCompareBarProps {
  products: ProductListItem[];
  onToggleProduct: (product: ProductListItem) => void;
  onClear: () => void;
  onCompareNow: () => void;
}

export function ProductCompareBar({
  products,
  onToggleProduct,
  onClear,
  onCompareNow,
}: ProductCompareBarProps) {
  if (products.length === 0) return null;

  const atLimit = products.length >= MAX_COMPARED_PRODUCTS;
  const isCompareDisabled = products.length < 2;

  const countText = formatLabel(LABELS.compareSelectionCount, {
    count: String(products.length),
    max: String(MAX_COMPARED_PRODUCTS),
  });

  const limitText = formatLabel(LABELS.compareMaxReached, {
    max: String(MAX_COMPARED_PRODUCTS),
  });

  return (
    <div className={productCompareBarStyles.root}>
      <div className={productCompareBarStyles.container}>
        <div className={productCompareBarStyles.leftColumn}>
          <p className={productCompareBarStyles.countText} aria-live="polite">
            {countText}
          </p>
          {atLimit ? (
            <p className={productCompareBarStyles.warningText} role="status">
              {limitText}
            </p>
          ) : null}
          <ProductCompareTagsList
            products={products}
            onToggleProduct={onToggleProduct}
          />
        </div>
        <div className={productCompareBarStyles.rightActions}>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            {LABELS.clear}
          </Button>
          <DisabledActionHint
            disabled={isCompareDisabled}
            message={LABELS.compareMinRequired}
          >
            <Button
              type="button"
              size="sm"
              disabled={isCompareDisabled}
              onClick={onCompareNow}
            >
              {LABELS.compareNow}
            </Button>
          </DisabledActionHint>
        </div>
      </div>
    </div>
  );
}
